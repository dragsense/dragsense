<?php

namespace DragSense\AutoCode\Services;

use DragSense\AutoCode\Http\Exceptions\ApiError;
use DragSense\AutoCode\Models\Collection;
use DragSense\AutoCode\Models\Component;
use DragSense\AutoCode\Models\Form;
use DragSense\AutoCode\Models\Layout;
use DragSense\AutoCode\Models\Page;
use DragSense\AutoCode\Utils\Utils;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Str;

class SettingServices
{
    protected $dataDir;
    protected $filePath;
    protected $documentServices;
    protected $collectionServices;
    public function __construct(DocumentServices $documentServices, CollectionServices $collectionServices)
    {
        $this->dataDir = storage_path('app/private/data');
        $this->filePath = $this->dataDir . '/setting.json';

        // Check if the directory exists, and create it if not
        if (!File::exists($this->dataDir)) {
            try {
                File::makeDirectory($this->dataDir, 0755, true);
            } catch (\Exception $e) {
                Log::error('Failed to create data directory: ' . $e->getMessage());
                throw new \Exception('Failed to create data directory.', 500);
            }
        }


        // Check and create additional files if needed
        $files = ['setting.json'];
        foreach ($files as $file) {
            $filePath = $this->dataDir . '/' . $file;
            if (!File::exists($filePath)) {
                try {
                    File::put($filePath, json_encode([]));
                } catch (\Exception $e) {
                    Log::error("Failed to create file $file: " . $e->getMessage());
                    throw new \Exception("Failed to create file $file.", 500);
                }
            }
        }

        $this->documentServices = $documentServices;
        $this->collectionServices = $collectionServices;

    }

    /**
     * Get settings from the settings file
     *
     * @return array
     * @throws ApiError
     */
    public function getSettings(): array
    {
        try {
            $data = File::get($this->filePath);
            return json_decode($data, true) ?? [];
        } catch (\Exception $e) {
            Log::error('Failed to read settings file: ' . $e->getMessage());
            throw new ApiError('Failed to read settings file.', 500);
        }
    }

    /**
     * Save settings to the settings file
     *
     * @param array $settings
     * @return array
     * @throws ApiError
     */
    public function saveSettings(array $settings): array
    {
        if (isset($settings['scripts'])) {
            $settings['scripts']['head'] = html_entity_decode($settings['scripts']['head'] ?? '');
            $settings['scripts']['footer'] = html_entity_decode($settings['scripts']['footer'] ?? '');
        }

        try {
            File::put($this->filePath, json_encode($settings, JSON_PRETTY_PRINT));
        } catch (\Exception $e) {
            Log::error('Failed to write to settings file: ' . $e->getMessage());
            throw new ApiError('Failed to write to settings file.', 500);
        }

        return $settings;
    }


    /**
     * Get a page data
     *
     * @param string $id
     * @param string $type
     * @param string $host
     * @param bool $withCss
     * @param string|null $streame
     * @return mixed
     * @throws ApiError
     */
    public function getPageData($id, $type, $host, $withCss = false, $remainingSlug = null)
    {
        $page = null;

        if ($type === 'page') {
            $page = Page::find($id);
        } elseif ($type === 'component') {
            $page = Component::find($id);
        } elseif ($type === 'collection') {
            $page = Collection::find($id);
        } elseif ($type === 'form') {
            $page = Form::find($id);
        } elseif ($type === 'layout') {
            $page = Layout::find($id);
        }



        if (!$page) {
            throw new ApiError('Page not found', 404);
        }

        try {

            $page->populatedImage = $page->populatedImages;

            $pages = [];

            // Initialize the css array
            $style = ['css' => []];

            // If withCss is true, generate the css for the page styles and add it to the css array
            if ($withCss) {
                $styles = (array) ($page->styles ?? []);
                $style['css'] = [Utils::generateElementsCss($styles)];
            }



            $settingData = [];
            // Initialize relationships array
            $relationships = [];

            // Check if populatedRelationships exists and is not empty
            if (!empty($page->populatedRelationships)) {
                foreach ($page->populatedRelationships as $rel) {
                    $relationships[$rel->_id] = $rel->name;
                }
            }

            // Initialize populatedRelationships
            $populatedRelationships = [];

            // Check if populatedRelationships is an array
            if (is_array($page->populatedRelationships)) {
                foreach ($page->populatedRelationships as $collection) {
                    $populatedRelationships[$collection->_id] = [$collection];
                }
            }

            $components = $page->components ?? [];
            $this->loadComponents($components, $pages, $style, $host, $withCss);

            $forms = $page->forms ?? [];
            $this->loadForms($forms, $pages, $style, $withCss);



            $mainPageData = [
                'pageSetting' => [
                    '_id' => $page->_id,
                    'setting' => $page->setting,
                    'states' => $page->states,
                    'name' => $page->name,
                    'slug' => $page->slug,
                    'relationships' => $relationships,
                    'populatedRelationships' => $populatedRelationships,
                    'creator' => $page->creator,
                    'createdAt' => $page->createdAt,
                    'url' => $page->url,
                    'host' => $host,
                    ...$settingData,
                ],
            ];

            $defaultElements = [
                '0' => [
                    '_uid' => '0',
                    'tagName' => 'div',
                    'type' => 'layout',
                    'layout' => 'root',
                    'nodeValue' => '',
                    'childNodes' => [],
                ],
            ];

            // Set default page elements
            $pageElements = $page->elements ?? $defaultElements;

            // Check if layout exists
            $layout = Layout::find($page->layout);

            if ($layout) {
                // If CSS is needed, generate it
                if ($withCss) {
                    $styles = $layout->styles ?? [];
                    $styleCss = Utils::generateElementsCss($styles);
                    $style['css'] = array_merge($style['css'], [$styleCss]);
                }

                // Load layout components and forms
                $components = $layout->components ?? [];
                $forms = $layout->forms ?? [];

                $this->loadComponents($components, $pages, $style, $host, $withCss);
                $this->loadForms($forms, $pages, $style, $withCss);

                // Initialize layout elements
                $layoutElements = $layout->elements ?? $defaultElements;

                // Adjust main layout
                if (isset($layoutElements[$layout->main])) {
                    $layoutElements[$layout->main]['childNodes'][] = 'main';
                } else {
                    $layoutElements['0']['childNodes'][] = 'main';
                }

                // Update the main element in page elements
                $pageElements['main'] = $pageElements['0'];
                unset($pageElements['0']);

                // Merge layout elements with page elements
                $pages[$page->_id] = array_merge([
                    'elements' => array_merge($layoutElements, $pageElements),
                ], $mainPageData);
            } else {
                // No layout, just use page elements
                $pages[$page->_id] = array_merge([
                    'elements' => $pageElements,
                ], $mainPageData);
            }

            $mergedData = array_merge(
                $style,
                [
                    'pages' => $pages,
                ]
            );

            return $mergedData;

        } catch (\Exception $e) {
            // Log the error and rethrow it
            \Log::error('An unexpected error occurred:', ['exception' => $e]);
            throw new ApiError('An unexpected error occurred', 500);
        }
    }


    public function loadComponents(array $components, &$pages, &$style, $host, $withCss)
    {
        foreach ($components as $componentId) {
            $this->loadSingleComponent($componentId, $pages, $style, $host, $withCss);
        }
    }

    protected function loadSingleComponent($componentId, &$pages, &$style, $host, $withCss = false)
    {
        $component = Component::find($componentId);


        if ($component && !isset($pages[$component->_id])) {
            $pages[$component->_id] = [
                'elements' => $component->elements ?? [],
                'states' => $component->states ?? [],
                'events' => $component->events ?? [],
                'type' => $component->type ?? 'component',
            ];



            if ($withCss) {
                $styles = $component->styles ?? [];
                $generatedCss = [Utils::generateElementsCss($styles)];

                $style['css'] = array_merge($style['css'] ?? [], $generatedCss);
            }

            $parent = $this->getParent($component, $pages);
            //if ($parent) 
            //$this->handleAttachedComponent($component, $parent, $pages, $host);

            $innerComponents = $component->components ?? [];

            $this->loadComponents($innerComponents, $pages, $style, $host, $withCss);
        }


    }

    public function loadForms(array $forms, &$pages, &$style, $withCss)
    {
        foreach ($forms as $formId) {
            $this->loadSingleForm($formId, $pages, $style, $withCss);
        }
    }

    protected function loadSingleForm($formId, &$pages, &$style, $host, $withCss = false)
    {
        $form = Form::find($formId);

        if ($form && !isset($pages[$form->_id])) {
            $pages[$form->_id] = [
                'elements' => $form->elements ?? [],
                'states' => $form->states ?? [],
                'type' => $component->type ?? 'form',
                'setting' => $component->setting ?? [],
            ];

            if ($withCss) {
                $styles = $form->styles ?? [];
                $generatedCss = [Utils::generateElementsCss($styles)];

                $style['css'] = array_merge($style['css'] ?? [], $generatedCss);
            }

            $innerComponents = $form->components ?? [];

            $this->loadComponents($innerComponents, $pages, $style, $host, $withCss);
        }
    }


    /**
     * Get the parent component of a given component.
     *
     * @param Component 
     * @param array|null $projection 
     * @return Component|null 
     */
    protected function getParent(Component $component, &$pages)
    {
        $parent = [];

        // Check if the component has a parent
        if ($component->parent) {
            $parentId = (string) $component->parent;

            if (!isset($this->pages[$parentId])) {
                $pages[$parentId] = Component::find($parentId)->first();
            }

            // Set the parent component
            $parent = $pages[$parentId];
        }

        return $parent;
    }



    /**
     * Get a page elements
     *
     * @param string $id
     * @param string $type
     * @param string $host
     * @return mixed
     * @throws ApiError
     */
    public function getElements($id, $type, $host)
    {
        // Determine the model based on the type
        $Model = $type === 'collection' ? Collection::class :
            ($type === 'component' ? Component::class :
                ($type === 'form' ? Form::class :
                    ($type === 'layout' ? Layout::class : Page::class)));

        // Fetch the page using the determined model
        $page = $Model::find($id);

        // If the collection does not exist, throw an error
        if (!$page) {
            throw new ApiError('Elements not found', 404);
        }

        // Check if the elements array is empty or doesn't have a 0th element
        if (!isset($page->elements) || !isset($page->elements[0])) {
            $this->defaultElement($page, $type . ' Root Element', $type);

            // Save the updated page
            $page->save();
        }

        return $this->generateDocuments($page, $type, $host);

    }

  
    /**
     * Generator function that yields document data one by one.
     *
     * @param $page
     * @param $type
     * @param $host
     * @return \Generator
     */
    private function generateDocuments($page, $type, $host)
    {
        // Prepare the document to be returned
        $doc = $this->prepareDocument($page);
        $doc['type'] = $type;
        $doc['host'] = $host;

        // Add parent properties if available
        if ($page->parent) {
            $parent = Component::find($page->parent, ["states"]);
            if ($parent) {
                $doc['props'] = $parent->states;
            }
        }

        // Yield the main page document
        yield $doc;

        // Initialize an array to keep track of loaded collections
        $loaded = [$page->_id => true];

        // Load attached collections
        $collectionId = $page->attached;
        if ($collectionId) {
            yield from $this->loadFullCollection($collectionId, $loaded);
        }

        // Load components
        $components = $page->components ?? [];
        yield from $this->loadFullComponents($components, $loaded);

        // Load forms
        $forms = $page->forms ?? [];
        yield from $this->loadFullForms($forms, $loaded);
    }

      /**
     * Get a page styles
     *
     * @param string $id
     * @param string $type
     * @return mixed
     * @throws ApiError
     */
    public function getStyles(string $id, $type)
    {

        $Model = $type === 'collection' ? Collection::class :
            ($type === 'component' ? Component::class :
                ($type === 'form' ? Form::class :
                    ($type === 'layout' ? Layout::class : Page::class)));

        $projection = ['_styles', 'styles', '_id', 'published'];

        // Fetch the page using the determined model
        $page = $Model::find($id, $projection);

        // If the collection does not exist, throw an error
        if (!$page) {
            throw new ApiError('Styles not found', 404);
        }


        $doc = ['_id' => $page->_id];
        $doc['styles'] = $page->published ? $page->styles : $page->_styles;


        if (count($doc['styles']) > 0) {

            $jsonData = ['elements' => $doc['styles'], '_id' => $doc['_id']];
            yield $jsonData;

        }

        yield [];

    }

    /**
     * Default element creation method
     *
     * @param $page
     * @param string $name
     * @param string $type
     */
    private function defaultElement(&$page, $name, $type)
    {
        $id = Str::random(7);
        $className = "ac-elem-{$type}-root-{$id}";
        $styleUid = Str::random(7);

        $styles = [
            $styleUid => [
                '_uid' => $styleUid,
                'selectorText' => ".{$className}",
                'type' => 'div',
                'style' => [],
            ],
        ];

        $elements = [
            0 => [
                '_uid' => '0',
                'tagName' => 'div',
                'type' => 'layout',
                'name' => $name,
                'layout' => 'root',
                'nodeValue' => '',
                'childNodes' => [],
                'selector' => ".{$className}",
                'className' => $className,
                'styleUid' => $styleUid,
            ],
        ];

        $page->styles = $styles;
        $page->_styles = $styles;
        $page->elements = $elements;
        $page->_elements = $elements;
    }
    /**
     * Recursively loads and streams the components and their dependencies.
     *
     * @param array $components List of component IDs to load.
     * @param array $loaded List of already loaded components to avoid duplication.
     */
    public function loadFullComponents(array &$components, array &$loaded)
    {
        foreach ($components as $componentId) {
            // Find the component by ID
            $component = Component::find($componentId);

            // Check if component exists and hasn't been loaded yet
            if ($component && !isset($loaded[$componentId])) {

                // Prepare the document
                $doc = $this->prepareDocument($component);
                yield $doc;

                $loaded[$componentId] = true;

                // Recursively load attached collection and inner components
                $collectionId = $doc['attached'] ?? null;
                if ($collectionId) {
                    $this->loadFullCollection($collectionId, $loaded);
                }

                $innerComponents = $doc['components'] ?? [];
                $this->loadFullComponents($innerComponents, $loaded);

                $innerForms = $doc['forms'] ?? [];
                $this->loadFullComponents($innerForms, $loaded);
            }
        }
    }

    /**
     * Recursively loads and streams the forms and their components.
     *
     * @param array $forms List of form IDs to load.
     * @param array $loaded List of already loaded forms to avoid duplication.
     */
    public function loadFullForms(array &$forms, array &$loaded)
    {
        foreach ($forms as $formId) {
            // Find the form by ID
            $form = Form::find($formId);

            // Check if form exists and hasn't been loaded yet
            if ($form && !isset($loaded[$formId])) {
                // Prepare the document
                $doc = $this->prepareDocument($form);
                yield $doc;

                $loaded[$formId] = true;
                // Recursively load inner components of the form
                $innerComponents = $doc['components'] ?? [];
                $this->loadFullComponents($innerComponents, $loaded);
            }
        }
    }

    /**
     * Loads and streams a collection by its ID, including its setting and populated images.
     *
     * @param string $collectionId The ID of the collection to load.
     * @param array $loaded List of already loaded collections to avoid duplication.
     */
    public function loadFullCollection(string $collectionId, array &$loaded)
    {
        // Check if collection ID is valid and hasn't been loaded yet
        if ($collectionId && !isset($loaded[$collectionId])) {
            $loaded[$collectionId] = true;

            // Define the fields to select
            $projection = [
                'states',
                'relationships',
                '_states',
                'published',
                'type',
                'setting',
                'created_at',
                'creator',
                'url',
                'slug',
                'name',
                '_id'
            ];

            // Find the collection by ID with the specified projection
            $collection = Collection::select($projection)->find($collectionId);

            if ($collection) {
                // Update collection settings with populated images and relationships
                $setting = $collection->setting;
                $setting["populatedImage"] = $collection->populatedImages;
                $collection->setting = $setting;
                $collection->populatedRelationships = $collection->relations;

                // Prepare the document and push to stream
                $doc = $this->prepareDocument($collection);
                yield $doc;
            }
        }
    }

    /**
     * Retrieves the default value based on the type of trigger.
     *
     * @param string $type The type of trigger (STATES or PROPS).
     * @param string $key The key to look up.
     * @param array $states The states array.
     * @param array $props The properties array.
     * @param mixed $value The default value if not found in states or props.
     * @param mixed $host The host parameter for additional context.
     * @return mixed The resolved default value.
     */
    protected function getDefaultValue($type, $key, $states, $props, $value, $host)
    {
        switch ($type) {
            case 'STATES':
                return Utils::getStateValue($key, $states, $host);
            case 'PROPS':
                return Utils::getStateValue($key, $props, $host);
            default:
                return $value;
        }
    }

    /**
     * Creates a filter object with computed default values.
     *
     * @param array $filter The filter configuration.
     * @param array $states The states array.
     * @param array $props The properties array.
     * @param mixed $host The host parameter for additional context.
     * @return array The created filter object.
     */
    protected function createFilterObject($filter, $states, $props, $host)
    {
        $type = $filter['triggerType'];
        $key = $filter['triggerKey'];
        $value = $filter['defaultValue'];

        // Compute the default value based on the trigger type
        $defaultValue = $this->getDefaultValue($type, $key, $states, $props, $value, $host);

        return [
            'filterKey' => array_merge([$filter['type']], $filter['filterKey']),
            'defaultValue' => $defaultValue ?? ''
        ];
    }

    /**
     * Processes a list of filters to create filter objects.
     *
     * @param array|null $filters The list of filters.
     * @param array $states The states array.
     * @param array $props The properties array.
     * @param mixed $host The host parameter for additional context.
     * @return array The list of processed filter objects.
     */
    protected function getFilters($filters, $states, $props, $host)
    {
        $resultFilters = [];

        if (!$filters) {
            return $resultFilters;
        }

        foreach ($filters as $filter) {
            $resultFilters[] = $this->createFilterObject($filter, $states, $props, $host);
        }

        return $resultFilters;
    }

    /**
     * Fetches documents by their IDs with optional relationships.
     *
     * @param string $id The ID of the collection.
     * @param array $docs List of documents to fetch.
     * @param bool $withRelationship Whether to include relationships.
     * @param array $selectedRelationships List of selected relationships.
     * @return array The fetched documents.
     */
    protected function fetchDocumentsByIds($id, $docs, $withRelationship, $selectedRelationships)
    {
        $docIds = array_map(fn($doc) => $doc['_id'], $docs);

        return $this->documentServices->getAllFilteredDocuments($id, [
            'documentIds' => $docIds,
            'withRelationship' => $withRelationship,
            'selectedRelationships' => $selectedRelationships
        ], [], []);
    }

    /**
     * Fetches all documents with filters, sorting, and pagination.
     *
     * @param string $id The ID of the collection.
     * @param array|null $filters The filters to apply.
     * @param array $states The states array.
     * @param array $props The properties array.
     * @param bool $withRelationship Whether to include relationships.
     * @param array $selectedRelationships List of selected relationships.
     * @param string $sortBy Field to sort by.
     * @param string $sort Sort direction (asc/desc).
     * @param int $limit Number of documents per page.
     * @param int $page Page number for pagination.
     * @param mixed $host The host parameter for additional context.
     * @return array The fetched documents with pagination info.
     */
    protected function fetchAllDocuments($id, $filters, $states, $props, $withRelationship, $selectedRelationships, $sortBy, $sort, $limit, $page, $host)
    {
        // Compute filters with default values
        $computedFilters = $this->getFilters($filters, $states, $props, $host);

        return $this->documentServices->getAllFilteredDocuments(
            $id,
            [
                'filters' => $computedFilters,
                'withRelationship' => $withRelationship,
                'selectedRelationships' => $selectedRelationships
            ],
            [],
            [
                'page' => $page,
                'limit' => $limit,
                'sortBy' => $sortBy . ':' . $sort
            ]
        );
    }

    /**
     * Loads documents from a collection, either by IDs or with filters.
     *
     * @param array $collection The collection data.
     * @param array $states The states array.
     * @param array $props The properties array.
     * @param mixed $host The host parameter for additional context.
     * @return array The collection with loaded documents and additional data.
     */
    public function loadDocuments($collection, $states, $props, $host)
    {
        $id = $collection['_id'] ?? null;

        if (!$id) {
            return $collection;
        }

        $docs = $collection['docs'] ?? [];
        $states = $collection['states'] ?? [];
        $setting = $collection['setting'] ?? [];
        $withRelationship = $collection['withRelationship'] ?? false;
        $selectedRelationships = $collection['selectedRelationships'] ?? [];
        $documents = [];
        $maxPage = $collection['maxPage'] ?? 0;

        if (!empty($docs)) {
            // Fetch documents by IDs
            $res = $this->fetchDocumentsByIds($id, $docs, $withRelationship, $selectedRelationships);
            $documents = $res['documents'] ?? [];
            $maxPage = $res['total'];
        } else {
            // Fetch all documents with filters and pagination
            $filters = $collection['filters'] ?? null;
            $sortBy = $collection['sortBy'] ?? 'created_at';
            $sort = $collection['sort'] ?? 'asc';
            $limit = $collection['limit'] ?? 10;
            $page = $collection['page'] ?? 1;

            $res = $this->fetchAllDocuments(
                $id,
                $filters,
                $states,
                $props,
                $withRelationship,
                $selectedRelationships,
                $sortBy,
                $sort,
                $limit,
                $page,
                $host
            );
            $documents = $res['documents'] ?? [];
            $maxPage = $res['total'];
        }

        return array_merge($collection, [
            'documents' => $documents,
            'states' => $states,
            'setting' => $setting,
            'maxPage' => $maxPage
        ]);
    }

    /**
     * Loads a collection by ID with specified projection fields.
     *
     * @param string $collection The ID of the collection to load.
     * @param array $projection The fields to select from the collection.
     * @return array|null The loaded collection data or null if not found.
     */
    public function loadCollection(
        $collection,
        $projection = [
            'states',
            'relationships',
            'setting',
            'name',
            '_id',
        ]
    ) {
        if ($collection) {
            $coll = Collection::find($collection)->select($projection);

            if ($coll) {
                return [
                    'createdAt' => $coll->createdAt,
                    'url' => $coll->url,
                    'name' => $coll->name,
                    'slug' => $coll->slug,
                    'elements' => $coll->elements ?? [],
                    'states' => $coll->states ?? [],
                    'setting' => $coll->setting ?? [],
                ];
            }
        }

        return null;
    }

    /**
     * Handles the attachment of a component to a collection and processes its related components.
     *
     * @param array $component The component data.
     * @param array $parent The parent component or context.
     * @param array &$pages Reference to the pages array where data will be stored.
     * @param mixed $host The host parameter for additional context.
     */
    public function handleAttachedComponent($component, $parent, &$pages, $host)
    {
        $collection = $component['attached'];

        if (!isset($pages[$collection])) {
            $pages[$collection] = $this->loadCollection($collection);
        }

        if (isset($pages[$collection])) {
            $pageSetting = $pages[$collection]['setting'] ?? [];

            // Handle related components if relationships are populated
            if (!empty($pageSetting['populatedRelationships']) && isset($component['collStates']['related'])) {
                $this->handleRelatedComponent($component, $pageSetting['populatedRelationships']);
            }

            // Merge collection states with additional data
            $collStates = array_merge($component['collStates'] ?? [], [
                '_id' => $collection,
                'name' => $pageSetting['name'] ?? '',
                'slug' => $pageSetting['slug'] ?? '',
                'created_at' => $pageSetting['created_at'] ?? '',
                'creator' => $pageSetting['creator'] ?? '',
                'setting' => $pageSetting['setting'] ?? [],
                'states' => $pageSetting['states'] ?? [],
            ]);

            // Load documents for the collection
            $collStates = $this->loadDocuments($collStates, $component['states'] ?? [], $parent['states'] ?? [], $host);
            $pages[$component['_id']]['collStates'] = $collStates;
        }
    }

    /**
     * Handles related components by setting filters based on populated relationships.
     *
     * @param array $component The component data.
     * @param array $populatedRelationships The populated relationships for the component.
     */
    public function handleRelatedComponent($component, $populatedRelationships)
    {
        if (!isset($component['collStates']['filters'])) {
            $component['collStates']['filters'] = [];
        }

        foreach ($populatedRelationships as $index => $rel) {
            if ($rel) {
                $component['collStates']['filters']["__related_{$index}__"] = [
                    'name' => 'Related',
                    'type' => 'RELATIONSHIPS',
                    'filterKey' => [$rel['_id']],
                    'defaultValue' => isset($populatedRelationships[$rel['_id']])
                        ? array_map(fn($v) => $v['_id'], $populatedRelationships[$rel['_id']])
                        : [],
                ];
            }
        }
    }


    /**
     * Get a page CSS
     *
     * @param string $id
     * @param string $type
     * @return array
     * @throws ApiError
     */
    public function getCss($id, $type)
    {
        // Find the page by ID
        $page = null;

        if ($type === 'page') {
            $page = Page::find($id);
        } elseif ($type === 'component') {
            $page = Component::find($id);
        } elseif ($type === 'collection') {
            $page = Collection::find($id);
        } elseif ($type === 'form') {
            $page = Form::find($id);
        } elseif ($type === 'layout') {
            $page = Layout::find($id);
        }

        if (!$page) {
            throw new ApiError('Page not found', 404);
        }

        try {
            $style = ['css' => []];
            $doc = [];

            if (!$page->published) {
                $doc['styles'] = (array) $page->_styles;
            } else {
                $doc['styles'] = (array) $page->styles;

            }

            $style['css'] = $this->generateCssForStyles($doc['styles']);

            return $style;


        } catch (\Exception $e) {
            // Log the error and rethrow it
            \Log::error('An unexpected error occurred:', ['exception' => $e]);
            throw new ApiError('An unexpected error occurred', 500);
        }
    }


    /**
     * Generate CSS for the styles
     *
     * @param array $styles
     * @param string $id
     * @return array
     */
    private static function generateCssForStyles(array &$styles): array
    {
        $css = [];
        $css[] = Utils::generateElementsCss($styles);

        return $css;
    }

    /**
     * Prepares a document representation of a collection.
     *
     * This method creates a structured array representation of the collection
     * based on its properties and whether it is published or not.
     *
     * @param object $collection The collection object to be prepared.
     * @return array The prepared document array.
     */
    private function prepareDocument($collection)
    {
        // Create the base document structure
        $doc = [
            'type' => $collection->type,
            'createdAt' => $collection->createdAt,
            'creator' => $collection->creator,
            'setting' => $collection->setting,
            'populatedRelationships' => $collection->populatedRelationships,
            'name' => $collection->name,
            'slug' => $collection->slug,
            'url' => $collection->url,
            '_id' => $collection->_id,
            'attached' => $collection->attached,
            'parent' => $collection->parent,
            'main' => $collection->main,
        ];

        // Conditionally add properties based on publication status
        if (!$collection->published) {
            // Add internal properties if the collection is not published
            $doc['elements'] = $collection->_elements;
            $doc['components'] = $collection->_components;
            $doc['forms'] = $collection->_forms;
            $doc['states'] = $collection->_states;
            $doc['collStates'] = $collection->_collStates;
            $doc['events'] = $collection->_events;
        } else {
            // Add public properties if the collection is published
            $doc['elements'] = $collection->elements;
            $doc['components'] = $collection->components;
            $doc['forms'] = $collection->forms;
            $doc['states'] = $collection->states;
            $doc['collStates'] = $collection->collStates;
            $doc['events'] = $collection->events;
        }

        return $doc;
    }


}
