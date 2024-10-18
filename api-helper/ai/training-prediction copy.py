import torch
from transformers import T5ForConditionalGeneration, T5Tokenizer
import json
import os
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Path to save the model locally
MODEL_DIR = "./trained_model_t5_small"
TRAINING_DATA_FILE = "./training_data/data.json"


# Function to load past training data
def load_training_data():
    if os.path.exists(TRAINING_DATA_FILE):
        with open(TRAINING_DATA_FILE, "r") as f:
            return json.load(f)
    return []

# Function to save new training data
def save_training_data(data):
    with open(TRAINING_DATA_FILE, "w") as f:
        json.dump(data, f)


# Function to load the T5 model
def load_model():
    if os.path.exists(MODEL_DIR):
        logging.info("Loading model from local directory.")
        model = T5ForConditionalGeneration.from_pretrained(MODEL_DIR)
        tokenizer = T5Tokenizer.from_pretrained(MODEL_DIR)
    else:
        logging.info("No pre-trained model found, loading T5-small as a base.")
        model_name = "t5-small"  # You can use other variants like "t5-large"
        model = T5ForConditionalGeneration.from_pretrained(model_name)
        tokenizer = T5Tokenizer.from_pretrained(model_name)


    logging.info("Model and tokenizer loaded successfully.")
    return model, tokenizer

# Function to save the model after retraining
def save_model(model, tokenizer):
    try:
        
            model.save_pretrained(MODEL_DIR, safe_serialization=False)
            tokenizer.save_pretrained(MODEL_DIR)
            logging.info("Model and tokenizer saved to local directory.")
    except Exception as e:
        logging.error(f"Error saving model: {e}")

# Function to generate JSON from input text using T5
def text_to_json(input_text, model, tokenizer, max_length=512):

    logging.info(f"Generating Text for input text: {input_text}")

    inputs = tokenizer(input_text, return_tensors="pt").input_ids

    # Generate JSON output
    outputs = model.generate(inputs, max_length=max_length, num_beams=4, early_stopping=True)

    # Decode the output into text and attempt to parse as JSON
    generated_json_str = tokenizer.decode(outputs[0], skip_special_tokens=True)

    logging.info(f"Generated raw string from model: '{generated_json_str}'")

    return generated_json_str

# Function to freeze all layers except the last one
def freeze_last_n_layers(model, n=1):
 
    # Get the number of layers in the transformer model
    num_layers = len(model.encoder.block)  # For T5, it's model.encoder.block

    # Freeze all parameters initially
    for param in model.parameters():
        param.requires_grad = False

    # Unfreeze the last n layers
    for i in range(num_layers - n, num_layers):
        for param in model.encoder.block[i].parameters():
            param.requires_grad = True

    logging.info(f"Unfroze the last {n} layers.")


# Function to retrain the model with new and old data
def retrain_model(data, model, tokenizer, epochs=3, unfreeze_last_n_layers=1, max_length=512):
    logging.info(f"Starting model fine-tuning")

   # Freeze all layers except the last 'n' layers
    if unfreeze_last_n_layers is not None:
        freeze_last_n_layers(model, n=unfreeze_last_n_layers)

    optimizer = torch.optim.AdamW(model.parameters(), lr=5e-5)
    model.train()

    for epoch in range(epochs):
        logging.info(f"Starting epoch {epoch + 1}/{epochs}")
        total_loss = 0

        for example in data:
            if 'input' in example and 'output' in example:
                # Prepare input and target texts
                inputs = tokenizer(
                    example['input'],
                    return_tensors="pt",
                    padding="max_length",
                    truncation=True,
                    max_length=max_length
                ).input_ids

                labels = tokenizer(
                    example['output'],
                    return_tensors="pt",
                    padding="max_length",
                    truncation=True,
                    max_length=max_length
                ).input_ids

                optimizer.zero_grad()
                outputs = model(input_ids=inputs, labels=labels)
                loss = outputs.loss
                total_loss += loss.item()
                loss.backward()
                optimizer.step()

                logging.info(f"Epoch {epoch + 1} loss: {loss.item():.4f}")
            else:
                logging.warning(f"Missing 'input' or 'output' in training data: {example}")

        avg_loss = total_loss / len(data)
        logging.info(f"Epoch {epoch + 1} average loss: {avg_loss:.4f}")

    # Save the fine-tuned model
    save_model(model, tokenizer)
    logging.info("Model fine-tuned and saved successfully.")

# Main function that handles operations
def main(operation, input_text="", data=[]):
    logging.info(f"Operation: {operation}")

    # Load model and tokenizer
    model, tokenizer = load_model()

    print("Loading Training Data...")
    training_data_jsons = load_training_data()

    if os.path.exists(TRAINING_DATA_FILE):
        training_data_jsons = load_training_data()
    else:
        print(f"Training data file {TRAINING_DATA_FILE} not found.")
        training_data_jsons = []

    if not os.path.exists(MODEL_DIR):
        retrain_model(training_data_jsons, model, tokenizer, epochs=3, unfreeze_last_n_layers=None)

    if operation == "generate":

        if input_text is None:
            print("No input text provided for generation.")
            return

        # Generate text from user input
        generated_text= text_to_json(input_text, model, tokenizer)
        print(generated_text)

    elif operation == "retrain":
        if len(data) == 0:
            print("No new data provided for retraining.")
            return
         
        retrain_model(data, model, tokenizer)

        training_data_jsons = training_data_jsons + data
        save_training_data(training_data_jsons)
        print("Training Data Updated")
        print("Model retrained successfully")

    logging.info("Operation completed.")

if __name__ == "__main__":
    import sys

    # Operation (generate or retrain) passed as an argument
    operation = sys.argv[1]

    if operation == "generate":
        input_text = sys.argv[2]
        main(operation, input_text=input_text)

    elif operation == "retrain":
        data_json = json.loads(sys.argv[2])
        main(operation, input_text="", data=data_json)



# import torch
# from transformers import T5ForConditionalGeneration, T5Tokenizer
# import uuid
# import json
# import os
# import logging
# import time
# import shutil

# # Set up logging
# logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# # Path to save the model locally
# MODEL_DIR = "./trained_model_t5_small"
# TRAINING_DATA_FILE = "./training_data/data.json"

# # Function to generate a unique ID
# def generate_id():
#     return str(uuid.uuid4())

# # Function to load past training data
# def load_training_data():
#     if os.path.exists(TRAINING_DATA_FILE):
#         with open(TRAINING_DATA_FILE, "r") as f:
#             return json.load(f)
#     return []

# # Function to save new training data
# def save_training_data(data):
#     with open(TRAINING_DATA_FILE, "w") as f:
#         json.dump(data, f)


# # Function to load the T5 model
# def load_model():
#     if os.path.exists(MODEL_DIR):
#         logging.info("Loading model from local directory.")
#         model = T5ForConditionalGeneration.from_pretrained(MODEL_DIR)
#         tokenizer = T5Tokenizer.from_pretrained(MODEL_DIR)
#     else:
#         logging.info("No pre-trained model found, loading T5-small as a base.")
#         model_name = "t5-small"  # You can use other variants like "t5-large"
#         model = T5ForConditionalGeneration.from_pretrained(model_name)
#         tokenizer = T5Tokenizer.from_pretrained(model_name)

#     logging.info("Model and tokenizer loaded successfully.")
#     return model, tokenizer

# # Function to save the model after retraining
# def save_model(model, tokenizer):
#     try:
#         if os.path.exists(MODEL_DIR):
#             logging.info("Deleting existing model directory.")
#             shutil.rmtree(MODEL_DIR)
#         model.save_pretrained(MODEL_DIR)
#         tokenizer.save_pretrained(MODEL_DIR)
#         logging.info("Model and tokenizer saved to local directory.")
#     except Exception as e:
#         logging.error(f"Error saving model: {e}")

# # Function to generate JSON from input text using T5
# def text_to_json(input_text, model, tokenizer):
#     logging.info(f"Generating seq for input text: {input_text}")

#     inputs = tokenizer(input_text, return_tensors="pt").input_ids

#     # Generate JSON output
#     outputs = model.generate(inputs, max_length=512, num_beams=4, early_stopping=True)

#     # Decode the output into text and attempt to parse as JSON
#     generated_json_str = tokenizer.decode(outputs[0], skip_special_tokens=True)
#     logging.info(f"Generated raw string from model: '{generated_json_str}'")

#     return generated_json_str

# # Function to freeze all layers except the last one
# def freeze_last_n_layers(model, n=1):
 
#     # Get the number of layers in the transformer model
#     num_layers = len(model.encoder.block)  # For T5, it's model.encoder.block

#     # Freeze all parameters initially
#     for param in model.parameters():
#         param.requires_grad = False

#     # Unfreeze the last n layers
#     for i in range(num_layers - n, num_layers):
#         for param in model.encoder.block[i].parameters():
#             param.requires_grad = True

#     logging.info(f"Unfroze the last {n} layers.")


# # Function to retrain the model with new and old data
# def retrain_model(data, model, tokenizer, epochs=3, unfreeze_last_n_layers=1, max_length=512):
#     logging.info(f"Starting model fine-tuning")

#    # Freeze all layers except the last 'n' layers
#     if unfreeze_last_n_layers is not None:
#         freeze_last_n_layers(model, n=unfreeze_last_n_layers)

#     optimizer = torch.optim.AdamW(model.parameters(), lr=5e-5)
#     model.train()

#     for epoch in range(epochs):
#         logging.info(f"Starting epoch {epoch + 1}/{epochs}")
#         total_loss = 0

#         for example in data:
#             if 'input' in example and 'output' in example:
#                 # Prepare input and target texts
#                 inputs = tokenizer(
#                     f"generate JSON: {example['input']}",
#                     return_tensors="pt",
#                     padding="max_length",
#                     truncation=True,
#                     max_length=max_length
#                 ).input_ids

#                 labels = tokenizer(
#                     json.dumps(example['output']),
#                     return_tensors="pt",
#                     padding="max_length",
#                     truncation=True,
#                     max_length=max_length
#                 ).input_ids

#                 optimizer.zero_grad()
#                 outputs = model(input_ids=inputs, labels=labels)
#                 loss = outputs.loss
#                 total_loss += loss.item()
#                 loss.backward()
#                 optimizer.step()

#                 logging.info(f"Epoch {epoch + 1} loss: {loss.item():.4f}")
#             else:
#                 logging.warning(f"Missing 'input' or 'target' in training data: {example}")

#         avg_loss = total_loss / len(data)
#         logging.info(f"Epoch {epoch + 1} average loss: {avg_loss:.4f}")

#     # Save the fine-tuned model
#     save_model(model, tokenizer)
#     logging.info("Model fine-tuned and saved successfully.")

# # Main function that handles operations
# def main(operation, input_text="", data=[]):
#     logging.info(f"Operation: {operation}")

#     # Load model and tokenizer
#     model, tokenizer = load_model()
#     training_data_jsons = load_training_data()

#     if not os.path.exists(MODEL_DIR):
#         retrain_model(training_data_jsons, model, tokenizer, epochs=3, unfreeze_last_n_layers=None)

#     if operation == "generate":
#         # Generate JSON from user input
#         generated_json = text_to_json(input_text, model, tokenizer)
#         print(json.dumps(generated_json))

#     elif operation == "retrain":
#         if len(data) == 0:
#              print("No new data provided for retraining.")
#              return

#          # Combine new training data with old
#         training_data_jsons =  training_data_jsons + data
#         save_training_data(training_data_jsons)


#         retrain_model(data, model, tokenizer)
#         print("Model retrained successfully")

#     logging.info("Operation completed.")

# if __name__ == "__main__":
#     import sys

#     # Operation (generate or retrain) passed as an argument
#     operation = sys.argv[1]

#     if operation == "generate":
#         input_text = sys.argv[2]
#         main(operation, input_text=input_text)

#     elif operation == "retrain":
#         data_json = json.loads(sys.argv[2])
#         main(operation, input_text="", data=data_json)




# import os
# import json
# import re
# import sys
# import torch
# import logging
# from transformers import T5Tokenizer, T5ForConditionalGeneration, T5Config

# # Configure logging
# logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')



# class Seq2SeqT5Model:

#     def __init__(self, model_name="t5-small", model_path="trained_model/trained_model.pth", special_vocal_path="trained_model/special_vocab.json"):
#         self.model_name = model_name
#         self.model_path = model_path
#         self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

#         self.special_tokens = []
#         if os.path.exists(special_vocal_path):
#             logging.info(f"Loading Special Tokens {special_vocal_path}...")
#             with open(special_vocal_path, "r") as f:
#                 self.special_tokens = json.load(f)
        
#         # Load pre-trained tokenizer and model
#         self.tokenizer = T5Tokenizer.from_pretrained(model_name, legacy=False)
#         self.tokenizer.add_tokens(self.special_tokens)
#         config = T5Config.from_pretrained(model_name)
#         self.model = T5ForConditionalGeneration(config).to(self.device)
#         self.model.resize_token_embeddings(len(self.tokenizer))

#         # Optionally load a fine-tuned model
#         if os.path.exists(model_path):
#             logging.info(f"Loading model from {model_path}...")
#             self.model.load_state_dict(torch.load(model_path, weights_only=True))

#     def train(self, input_texts, target_texts, batch_size=8, epochs=3):
#         # Tokenize the input and target texts
#         inputs = self.tokenizer(input_texts, return_tensors="pt", padding=True, truncation=True).to(self.device)
#         targets = self.tokenizer(target_texts, return_tensors="pt", padding=True, truncation=True).to(self.device)

#         # Define optimizer
#         optimizer = torch.optim.AdamW(self.model.parameters(), lr=5e-5)

#         for epoch in range(epochs):
#             self.model.train()
#             for i in range(0, len(input_texts), batch_size):
#                 input_batch = {key: val[i:i + batch_size] for key, val in inputs.items()}
#                 target_batch = {key: val[i:i + batch_size] for key, val in targets.items()}

#                 # Forward pass
#                 outputs = self.model(input_ids=input_batch['input_ids'], labels=target_batch['input_ids'])
#                 loss = outputs.loss

#                 # Backward pass
#                 optimizer.zero_grad()
#                 loss.backward()
#                 optimizer.step()

#                 logging.info(f"Epoch {epoch + 1}/{epochs}, Batch {i//batch_size + 1}, Loss: {loss.item()}")

#         logging.info(f"Training complete. Saving model to {self.model_path}...")
#         torch.save(self.model.state_dict(), self.model_path)

#     def preprocess_input(self, input_text):
#         # Replace numbers with a placeholder token
#         processed_text = re.sub(r'\d+', '<number>', input_text)
#         numbers = re.findall(r'\d+', input_text)  # Extract numbers
#         return processed_text, numbers

#     def postprocess_output(self, output_text, numbers):
#         # Replace placeholder tokens with actual numbers
#         for num in numbers:
#             output_text = output_text.replace('<number>', num, 1)  # Replace one at a time
#         return output_text

#     def generate_text(self, input_text):



#         #processed_text, numbers = self.preprocess_input(input_text)

#         #logging.info(f"processed_text {processed_text}...")

#         # Tokenize the input text
#         input_ids = self.tokenizer(input_text, return_tensors="pt", padding=True, truncation=True).input_ids.to(self.device)

#         # Generate prediction
#         outputs = self.model.generate(input_ids)

#         # Decode the generated tokens
#         predicted_text = self.tokenizer.decode(outputs[0], skip_special_tokens=True)

#         #logging.info(f"predicted_text {predicted_text}...")

#         #final_output = self.postprocess_output(predicted_text, numbers)
#         return predicted_text

# MODEL_DIR = "./trained_model/trained_model.pth"
# SPECIAL_VOCAB_FILE = './trained_model/special_vocab.json'
# TRAINING_DATA_FILE = "./training_data/data.json"

# # Function to load past training data
# def load_training_data():
#     logging.info("Checking if training data file exists...")
#     if os.path.exists(TRAINING_DATA_FILE):
#         logging.info(f"Training data file {TRAINING_DATA_FILE} found. Loading data...")
#         with open(TRAINING_DATA_FILE, "r") as f:
#             data = json.load(f)
#             logging.info(f"Loaded {len(data)} data points from the training file.")
#             return data
#     logging.warning(f"Training data file {TRAINING_DATA_FILE} not found. No previous data loaded.")
#     return []

# # Function to save new training data
# def save_training_data(data):
#     logging.info(f"Saving new training data to {TRAINING_DATA_FILE}...")
#     with open(TRAINING_DATA_FILE, "w") as f:
#         json.dump(data, f)
#     logging.info(f"Successfully saved {len(data)} data points.")

# def main(operation, input_text=None, new_data=[]):
#     logging.info("Starting the main function...")
#     logging.info(f"Operation selected: {operation}")
    
#     training_data_jsons = []

#     seq2seq = Seq2SeqT5Model(model_path=MODEL_DIR, special_vocal_path=SPECIAL_VOCAB_FILE)

#     if operation == "retrain":
#         logging.info("Loading Training Data...")
#         training_data_jsons = load_training_data()

#         # Load or create model
#         if not os.path.exists(MODEL_DIR):
#             if len(training_data_jsons) > 0:
#                 logging.info("Retraining the model with the loaded training data...")
#                 input_texts = [pair['input'] for pair in training_data_jsons]
#                 target_texts = [pair['output'] for pair in training_data_jsons]
#                 seq2seq.train(input_texts, target_texts)
 

#         #new_data = training_data_jsons

#         if len(new_data) == 0:
#             logging.warning("No new data provided for retraining.")
#             return
        
#         input_texts = [pair['input'] for pair in new_data]
#         target_texts = [pair['output'] for pair in new_data]

#         seq2seq.train(input_texts, target_texts)
        
#         logging.info(f"Adding new data to the training data file...")
#         training_data_jsons.extend(new_data)
#         save_training_data(training_data_jsons)
    
#     elif operation == "generate":
#         if input_text is None:
#             logging.error("Input text is required for 'generate' operation.")
#             raise ValueError("Input text is required for 'generate' operation.")
        
#         # Predict the sequence
#         result = seq2seq.generate_text(input_text)
#         print(f"{result}")
#     else:
#         logging.error(f"Invalid operation: {operation}. Expected 'generate' or 'retrain'.")
#         raise ValueError(f"Invalid operation: {operation}. Expected 'generate' or 'retrain'.")

# if __name__ == "__main__":
#     # Checking if the correct number of arguments were passed
#     if len(sys.argv) < 2:
#         logging.error("Error: Operation not specified. Usage: python script.py [operation] [data]")
#         sys.exit(1)
   
#     # Operation (generate or retrain) passed as an argument
#     operation = sys.argv[1]

#     if operation == "generate":
#         if len(sys.argv) < 3:
#             logging.error("Error: Input text not provided for 'generate' operation.")
#             sys.exit(1)
        
#         input_text = sys.argv[2]
#         logging.info(f"Input text: {input_text}")
#         main(operation, input_text=input_text)
    

#     elif operation == "retrain":
#         if len(sys.argv) < 3:
#             logging.error("Error: JSON data not provided for 'retrain' operation.")
#             sys.exit(1)
        
#         data_json = json.loads(sys.argv[2])
#         logging.info(f"Data JSON for retraining: {data_json}")
#         main(operation, input_text="", new_data=data_json)

#     else:
#         logging.error(f"Error: Invalid operation '{operation}'. Must be 'generate' or 'retrain'.")
#         sys.exit(1)




""" import sys
import os
import torch
import json
import time
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from torch.nn.utils.rnn import pad_sequence
from sklearn.model_selection import train_test_split
import logging

logging.basicConfig(level=logging.INFO, format='%(message)s\n\n')


# Positional Encoding Class
class PositionalEncoding(nn.Module):
    def __init__(self, embed_size, max_len=5000):
        super(PositionalEncoding, self).__init__()
        self.positional_embedding = nn.Embedding(max_len, embed_size)

    def forward(self, x):
        seq_len = x.size(1)
        positions = torch.arange(0, seq_len, device=x.device).unsqueeze(0).repeat(x.size(0), 1)
        pos_encoding = self.positional_embedding(positions)
        return x + pos_encoding

# Define the Encoder-Decoder model using PyTorch's built-in Transformer modules
class TransformerModel(nn.Module):
    def __init__(self, input_size, output_size, embed_size, num_heads, num_layers, dropout):
        super(TransformerModel, self).__init__()
        self.encoder_embedding = nn.Embedding(input_size, embed_size)
        self.decoder_embedding = nn.Embedding(output_size, embed_size)

        self.positional_encoding = PositionalEncoding(embed_size)  # Add PositionalEncoding

        self.transformer_encoder = nn.TransformerEncoder(
            nn.TransformerEncoderLayer(embed_size, num_heads, embed_size * 4, dropout, batch_first=True),
            num_layers
        )

        self.transformer_decoder = nn.TransformerDecoder(
            nn.TransformerDecoderLayer(embed_size, num_heads, embed_size * 4, dropout, batch_first=True),
            num_layers
        )

        self.fc_out = nn.Linear(embed_size, output_size)

    def forward(self, source, target):
        # Apply embeddings and positional encoding
        source_embedded = self.encoder_embedding(source) * torch.sqrt(torch.tensor(source.shape[1], dtype=torch.float32))
        target_embedded = self.decoder_embedding(target) * torch.sqrt(torch.tensor(target.shape[1], dtype=torch.float32))

        # Apply positional encoding to source and target
        source_embedded = self.positional_encoding(source_embedded)  
        target_embedded = self.positional_encoding(target_embedded)  

        # Encoder and Decoder Passes
        encoder_output = self.transformer_encoder(source_embedded)
        output = self.transformer_decoder(target_embedded, encoder_output)
        
        return self.fc_out(output)  # Directly return output without permuting

# Train the Model
def train(model, data_loader, criterion, optimizer, num_epochs, device):
    model.train()
    for epoch in range(num_epochs):

        running_loss = 0.0
        total_batches = len(data_loader)

        for source, output in data_loader:
            source, output = source.to(device), output.to(device)
            
            optimizer.zero_grad()
            # Pass the entire output sequence to the model
            predicted_output = model(source, output[:, :-1])  # Target excluding last token
            loss = criterion(predicted_output.reshape(-1, predicted_output.size(-1)), output[:, 1:].reshape(-1)) # Shift target
            running_loss += loss.item()
        
            loss.backward()
            optimizer.step()
            


        avg_loss = running_loss / total_batches
        logging.info(f"Epoch: <strong>[{epoch + 1}/{num_epochs}]</strong>, Loss: <strong>{running_loss:.4f}</strong> Average Loss: <strong>{avg_loss:.4f}</strong>\n")
        time.sleep(0.1)

# Prediction
def predict(model, input_seq, output_vocab, device):
    model.eval()
    with torch.no_grad():
        input_tensor = input_seq.unsqueeze(0).to(device)
        start_token = output_vocab.get('<START>', 0)
        decoder_input = torch.tensor([[start_token]], dtype=torch.long).to(device)

        predicted_sequence = []

        length = 0  # Initialize length counter
        
        while length < len(output_vocab):  # Limit predictions to max_length tokens
            # Pass the current decoder input to the model along with the encoder output
            output = model(input_tensor, decoder_input)

            # Get the predicted token (the last token in the output sequence)
            next_token = output.argmax(dim=-1)[:, -1].item()

            # Check for end token
            if next_token == output_vocab.get('<END>', -1):
                break

            predicted_sequence.append(next_token)

            # Update the decoder input for the next iteration
            decoder_input = torch.cat([decoder_input, torch.tensor([[next_token]], device=device)], dim=1)

        
            length += 1  # Increment length counter
    
    return predicted_sequence


# Save the model
def save_model(model, optimizer, filepath="model.pth"):
    torch.save({
        'model_state_dict': model.state_dict(),
        'optimizer_state_dict': optimizer.state_dict(),
    }, filepath)

# Load the model
def load_model(model, optimizer, filepath="model.pth", device='cpu'):
    if os.path.exists(filepath):
        checkpoint = torch.load(filepath, map_location=device, weights_only=True)
        model.load_state_dict(checkpoint['model_state_dict'])
        optimizer.load_state_dict(checkpoint['optimizer_state_dict'])
        logging.info(f"Model loaded from {filepath}\n")
        time.sleep(0.1)
    else:
        logging.info(f"No model found at {filepath}. Training from scratch.\n")
        time.sleep(0.1)



# Extend vocab with numbers 1-100
def extend_vocab_with_numbers(vocab, start=1, end=100):
    current_vocab_size = len(vocab)
    for i in range(start, end + 1):
        vocab[str(i)] = current_vocab_size
        current_vocab_size += 1

# Tokenization and encoding, handling <START> and <END> tokens
def encode_sentence(sentence, vocab, use_start_end=False):
    tokens = sentence.split()
    if use_start_end:
        tokens = ['<START>'] + tokens + ['<END>']
    return [vocab.get(token, vocab.get('<UNK>', -1)) for token in tokens]


def train_collate_fn(batch):
    input_sequences, output_sequences = zip(*batch)
    padded_inputs = pad_sequence([seq for seq in input_sequences], batch_first=True, padding_value=0)
    padded_outputs = pad_sequence([seq for seq in output_sequences], batch_first=True, padding_value=0)
    return padded_inputs, padded_outputs

def test_collate_fn(batch):
    return batch

# Dataset and DataLoader
class SimpleDataset(Dataset):
    def __init__(self, data, vocab, is_test_data=False):
        self.inputs = []
        self.outputs = []
        self.is_test_data = is_test_data

        for item in data:
            input_str = item['input']
            output_str = item['output']

            if self.is_test_data is True:
               self.inputs.append(input_str)  # Keep original input for test
            else:
                self.inputs.append(encode_sentence(input_str, vocab))  # Encode and store the input
                self.outputs.append(encode_sentence(output_str, vocab, use_start_end=True))  # Encode output with <START> and <END>
                
    def __len__(self):
        return len(self.inputs)

    def __getitem__(self, idx):

        if self.is_test_data is True:
            return self.inputs[idx]
        else:
            return torch.tensor(self.inputs[idx], dtype=torch.long), torch.tensor(self.outputs[idx], dtype=torch.long)
    

def load_data(FILE):
    if os.path.exists(FILE):
        with open(FILE, "r") as f:
            data = json.load(f)
            return data
    return []

# Load Training Data
MODEL_FILE = "api-helper/ai/trained_model/trained_model.pth"
TRAINING_DATA_FILE = "api-helper/ai/training_data/data.json"
VOCAB_FILE = "api-helper/ai/training_data/vocab.json"


def prepare_vocab(VOCAB_FILE):
    logging.info("|------loading tokens------\n")
    time.sleep(0.1)
    vocab_list = load_data(VOCAB_FILE)
   
    logging.info(f"Total Tokens loaded: <strong>{len(vocab_list)}</strong>")
    time.sleep(0.1)
    logging.info("------tokens loaded------|\n")
    time.sleep(0.1)
    logging.info("|------preparing tokens------\n")
    time.sleep(0.1)
    vocab = {token: idx for idx, token in enumerate(vocab_list)}
    # Extend vocabularies with numbers 1-100
    extend_vocab_with_numbers(vocab, start=1, end=100)

    logging.info(f"Total Tokens Prepared: <strong>{len(vocab)}</strong>\n")
    time.sleep(0.1)
    logging.info("------tokens prepared------|\n")
    time.sleep(0.1)
    return vocab

def prepare_model(vocab):

    logging.info("|------loading model------\n")
    time.sleep(0.1)
    # Initialize Model, Optimizer, and Loss
    input_size = len(vocab) + 1
    output_size = len(vocab) + 1
    embed_size = 512
    num_heads = 16
    num_layers = 2
    learning_rate = 0.0001
    dropout = 0.1
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    model = TransformerModel(input_size, output_size, embed_size, num_heads, num_layers, dropout).to(device)
    
    optimizer = optim.Adam(model.parameters(), lr=learning_rate)

    load_model(model, optimizer, filepath=MODEL_FILE, device=device)

    logging.info("------model laoded------|\n")
    time.sleep(0.1)

    return model, optimizer, device


def retrain(vocab, model, optimizer, device):

    logging.info("|------loading data------\n")
    time.sleep(0.1)
    data = load_data(TRAINING_DATA_FILE)

    logging.info(f"Total Data loaded: <strong>{len(data)}</strong>\n")
    time.sleep(0.1)
    logging.info("------data loaded------|\n")
    time.sleep(0.1)

    logging.info("|------spliting data------\n")
    time.sleep(0.1)
    data_train, data_test = train_test_split(data, test_size=0.001, random_state=42)

    logging.info(f"Total Train Data: <strong>{len(data_train)}</strong>")
    time.sleep(0.1)
    logging.info(f"Total Test Data: <strong>{len(data_test)}</strong>")
    time.sleep(0.1)
    logging.info("------data splited------|\n")
    time.sleep(0.1)
    logging.info("|------prepare data loader------\n")
    time.sleep(0.1)

    train_dataset = SimpleDataset(data_train, vocab)
    test_dataset = SimpleDataset(data_test, vocab, is_test_data=True)

    batch_size = 10
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, collate_fn=train_collate_fn)
    test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False, collate_fn=test_collate_fn)

    # Logging the number of batches in the train and test loaders
    num_train_batches = len(train_loader)
    num_test_batches = len(test_loader)

    logging.info(f"Total number of batches in Train DataLoader: <strong>{num_train_batches}</strong>\n")
    time.sleep(0.1)
    logging.info(f"Total number of batches in Test DataLoader: <strong>{num_test_batches}</strong>\n")
    time.sleep(0.1)
    logging.info("------data loader prepared------|\n")
    time.sleep(0.1)

    num_epochs = 2
    criterion = torch.nn.CrossEntropyLoss(ignore_index=0)

    logging.info("|------training model------\n")
    time.sleep(0.1)
    train(model, train_loader, criterion, optimizer, num_epochs, device)
    logging.info("------model trained------|\n")
    time.sleep(0.1)
    logging.info("|------model predicting------\n")
    time.sleep(0.1)
    # Step 12: Predict on Test Data
    for batch_idx, test_inputs in enumerate(test_loader):  # We don't need the output in this case, just the input
    
        for i in range(len(test_inputs)):
            orignal_input = test_inputs[i]
            logging.info(f"Input (string): <strong>{orignal_input}</strong>\n") 
            time.sleep(0.2)
            processed_input = encode_sentence(orignal_input, vocab)
            processed_input = torch.tensor(processed_input, dtype=torch.long)
            predicted_output = predict(model, processed_input, vocab, device)
            predicted_tokens = [list(vocab.keys())[list(vocab.values()).index(idx)] for idx in predicted_output]
            predicted_string = ' '.join(predicted_tokens) 
            
            logging.info(f"Predicted Output (string): <strong>{predicted_string}</strong>\n")
            time.sleep(0.1)

    time.sleep(0.1)
    logging.info("------model predicted------|\n")
    time.sleep(0.1)
    logging.info("|------saving model------\n")
    time.sleep(0.1)
    save_model(model, optimizer, filepath=MODEL_FILE)
    logging.info("------model saved------|\n")
    time.sleep(0.1)

def generate(vocab, model, device, input_text = None): 

    logging.info("|------model predicting------\n")
    time.sleep(0.1)
    logging.info(f"Input (string): <strong>{input_text}</strong>\n")
    time.sleep(0.1)
    processed_input = encode_sentence(input_text, vocab)
    processed_input = torch.tensor(processed_input, dtype=torch.long)
    predicted_output = predict(model, processed_input, vocab, device)

    predicted_tokens = [list(vocab.keys())[list(vocab.values()).index(idx)] for idx in predicted_output]
    
    predicted_string = ' '.join(predicted_tokens) 

    logging.info(f"Predicted Output (string): <strong>{predicted_string}</strong>\n")
    time.sleep(0.1)

    logging.info("------model predicted------|\n")
    time.sleep(0.1)


if __name__ == "__main__":
    # Checking if the correct number of arguments were passed
    if len(sys.argv) < 2:
        logging.info("Error: Operation not specified. Usage: python script.py [operation] [data]\n")
        time.sleep(0.1)
        sys.exit(1)
   
    # Operation (generate or retrain) passed as an argument
    operation = sys.argv[1]

    vocab = prepare_vocab(VOCAB_FILE=VOCAB_FILE)
    model, optimizer, device = prepare_model(vocab)

    if operation == "generate":
        if len(sys.argv) < 3:
            logging.info("Error: Input text not provided for 'generate' operation.\n")
            time.sleep(0.1)
            sys.exit(1)
        
        input_text = sys.argv[2]
        generate(vocab=vocab, model=model, device=device, input_text=input_text)
    

    elif operation == "retrain":
        retrain(vocab=vocab, model=model, optimizer=optimizer, device=device)

    else:
        logging.info(f"Error: Invalid operation '{operation}'. Must be 'generate' or 'retrain'.\n")
        time.sleep(0.1)
        sys.exit(1) """