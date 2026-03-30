from langchain_community.llms import Ollama
from langchain.embeddings import OllamaEmbeddings
from langchain.vectorstores import Chroma

llm = Ollama(model="llama3")
embeddings = OllamaEmbeddings(model="llama3")

db = Chroma(persist_directory="./db", embedding_function=embeddings)

def rag_query(query):
    docs = db.similarity_search(query)

    context = "\n".join([d.page_content for d in docs])

    return llm.invoke(f"{context}\n\nQuestion: {query}")