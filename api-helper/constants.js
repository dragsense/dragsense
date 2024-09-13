export const ValidateProps = {
  user: {
    username: { type: 'string', minLength: 4, maxLength: 20 },
    name: { type: 'string', minLength: 1, maxLength: 50 },
    password: { type: 'string', minLength: 8 },
    email: { type: 'string', minLength: 1 },
    bio: { type: 'string', minLength: 0, maxLength: 160 },
    address: { type: 'string', minLength: 0, maxLength: 200 },
    city: { type: 'string', minLength: 0, maxLength: 160 },
    country: { type: 'string', minLength: 0, maxLength: 160 },
    postalCode: { type: 'string', minLength: 0, maxLength: 160 },
    roleName: { type: 'string', minLength: 0, maxLength: 160 },
    permissions:  { type: 'array'},
  },
  project: {
    name: { type: 'string', minLength: 1, maxLength: 280 },
    desc : { type: 'string', minLength: 1, maxLength: 500 },
    apiUrl: { type: 'string', minLength: 1, maxLength: 280 },
    apiVersion: { type: 'string', minLength: 1, maxLength: 280 },
    apiPrefix:{ type: 'string', minLength: 1, maxLength: 280 },
    platform: { type: 'string', minLength: 1, maxLength: 280 },
  },
  backup: {
    name: { type: 'string', minLength: 1, maxLength: 280 },
    preview: { type: 'string', format: 'url' },
    desc: { type: 'string', minLength: 0, maxLength: 1000 },
    published: { type: 'boolean'},

   },

   theme: {
    id: { type: 'string', minLength: 1, maxLength: 280 },

   },
};
