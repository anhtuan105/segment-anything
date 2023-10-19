from typing import Union

from fastapi import FastAPI,File, UploadFile

from typing import Annotated
from fastapi.middleware.cors import CORSMiddleware

from fastapi.responses import FileResponse


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}



@app.post("/create-model")
def create_onxx_image_model(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


from scripts.export_onnx_model import run_export



import subprocess
import shutil

# @app.post("/upload_image/")
async def upload_image(uploaded_file: UploadFile):
    file_location = f"media/image_upload.png"
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(uploaded_file.file, file_object)    

    print("file location: ",file_location)
    return file_location


@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile):

    image_path = await  upload_image(uploaded_file=file)
    print("image_path: ",image_path)
    
    model_type = "vit_b"
    checkpoint = "checkpoint/sam_vit_b_01ec64.pth"  
    input_image = image_path
    output_onnx_model = "model/upload_model.onnx"
    opset = 17
    return_single_mask = False
    gelu_approximate = False
    use_stability_score = False
    return_extra_metrics = False
    
    try:
        # comment: 
        print("RUNNING...")
        run_export(
            model_type=model_type,
            checkpoint=checkpoint,
            input=input_image,
            output=output_onnx_model,
            opset=opset,
            return_single_mask=return_single_mask,
            gelu_approximate=gelu_approximate,
            use_stability_score=use_stability_score,
            return_extra_metrics=return_extra_metrics,
        )
        
        copy_onnx_model()
        copy_image(image_path)

    except Exception as e:
        print("ERROR: ",e)
        raise e
    # end try
    
    
    
    return {"filename": file.filename}


def copy_image(image_path):
    print("COPY IMAGE SUCCESS: ",image_path)
    subprocess.run(["cp",image_path,"demo/src/assets/data/image_upload.png"]) 
    print("COPY IMAGE SUCCESS")


def copy_onnx_model():
    subprocess.run(["cp", "model/upload_model.onnx","demo/src/assets/model/upload_model.onnx"]) 
    subprocess.run(["cp", "embedding/image_upload_embedding.npy","demo/src/assets/embedding/upload_embedding.npy"]) 


file_path = "public/mau_text"

import shutil

@app.get("/download_file")
def download_file():
    
    # shutil.make_archive("segment.zip", 'zip', file_path)

    # return {"filename": "segment.zip"}
    zip_file = "public/segment.zip"
    return FileResponse(path=zip_file, filename="segment.zip")

