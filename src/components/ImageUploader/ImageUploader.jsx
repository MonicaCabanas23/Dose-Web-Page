import classes from "./ImageUploader.module.scss"
import ImageUploading from 'react-images-uploading';
import { useEffect, useState } from 'react';
import { ItemButton } from "../Buttons/ItemButton/ItemButton";

export const ImageUploader = ({item=false, handleSaveClick, number}) => {
    const [images, setImages] = useState([]);
    const maxNumber = number;

    useEffect(() => {
      if(item && item.picture) {
        // If there are several images
        if(Array.isArray(item.picture)) {
          const imagesArray = item.picture.map((picture) => {
            return {
              "data_url": picture,
              "file": picture
            }
          })
          setImages(imagesArray)
          return
        }

        // If there is only one image
        const imageObject = {
          "data_url": item.picture,
          "file": item.picture
        }
        setImages([imageObject])
      }
    }, [])
    
    const onChange = (imageList, addUpdateIndex) => {
        // data for submit
        setImages(imageList);
    };

    return (
        <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          // write your building UI
          <div className={classes["upload__image-wrapper"]}>
            <button
              className={classes["clickeable_drag"]}
              style={isDragging ? { color: '#7C4DFF' } : undefined}
              onClick={onImageUpload}
              {...dragProps}
            >
              Click or Drop here
            </button>            
            <div className={classes["items-container"]}>
              {imageList.map((image, index) => (
                <div key={index} className={classes["image-item"]}>
                  <div className={classes["picture"]}>
                    <img src={image['data_url']} alt="" width="100" />
                  </div>
                  <div className={classes["image-item__btn-wrapper"]}>
                    <ItemButton clickHandler={() => {onImageUpdate(index)}} icon="edit"/>
                    <ItemButton clickHandler={() => {onImageRemove(index)}} icon="delete"/>
                  </div>
                </div>
              ))}
            </div>
            <div className={classes["button_container"]}>
              <button className={classes["save_button"]} onClick={() => {handleSaveClick(images)}}>Save</button>
            </div>
          </div>
        )}
      </ImageUploading>
    )
}