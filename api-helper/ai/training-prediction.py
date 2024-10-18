import sys
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

        self.positional_encoding = PositionalEncoding(embed_size, input_size)  # Add PositionalEncoding

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
def load_model(model, optimizer, filepath="model.pth", retraining=True, device='cpu'):

    logging.info(f"retraining mode: <strong>{retraining}</strong>")
    time.sleep(0.1)

    if os.path.exists(filepath) and retraining == "true":
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

def prepare_model(vocab, retraining = True):

    logging.info("|------loading model------\n")
    time.sleep(0.1)
    # Initialize Model, Optimizer, and Loss
    input_size = len(vocab) + 1
    output_size = len(vocab) + 1
    embed_size = 256
    num_heads = 8
    num_layers = 2
    learning_rate = 0.0001
    dropout = 0.1
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    logging.info(f"Model device: <strong>{device}</strong>")
    time.sleep(0.1)

    model = TransformerModel(input_size, output_size, embed_size, num_heads, num_layers, dropout).to(device)
    
    optimizer = optim.Adam(model.parameters(), lr=learning_rate)

    load_model(model, optimizer, filepath=MODEL_FILE, retraining=retraining, device=device)

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
    retraining = sys.argv[2]
    
    vocab = prepare_vocab(VOCAB_FILE=VOCAB_FILE)
    model, optimizer, device = prepare_model(vocab, retraining=retraining)

    if operation == "generate":
        if len(sys.argv) < 4:
            logging.info("Error: Input text not provided for 'generate' operation.\n")
            time.sleep(0.1)
            sys.exit(1)
        
        input_text = sys.argv[3]
        generate(vocab=vocab, model=model, device=device, input_text=input_text)
    

    elif operation == "retrain":
        retrain(vocab=vocab, model=model, optimizer=optimizer, device=device)

    else:
        logging.info(f"Error: Invalid operation '{operation}'. Must be 'generate' or 'retrain'.\n")
        time.sleep(0.1)
        sys.exit(1)