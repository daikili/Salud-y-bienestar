import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import styled from 'styled-components';
import * as Yup from "yup";
import {
  postNew,
  startUploadingImage
} from "../../actions/postAction";

import { useForm } from "../../hooks/useForm";



const Title = styled.h2`

  color: #ffffff;
  background: #be83ffa6;
  padding: 10px;
  text-align: center;
  border-radius: 20px;
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: fit-content;
  margin: 0px auto;
  margin-top: 40px;

  `;
const Button = styled.button`
  width: max-content;
  margin: 0px auto;
`;


const AddPost = () => {
    const { postActive } = useSelector(state => state.post)
  const dispatch = useDispatch();

  const activeId = useRef(postActive.id)
  const [reset] = useForm(postActive)

  useEffect(() => {
      if (postActive.id !== activeId.current) {
          reset(postActive)
      }
      activeId.current = postActive.id
  }, [postActive ,reset])

  
  const formik = useFormik({
    initialValues: {
      ...postActive,
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .min(5, "El nombre es muy corto")
        .required("Escribe un titulo para la publicación."),
      
      
     
      posts: Yup.string()
        .min(25, "La publicación es muy corta")
        .required("Publicación requerida!"),
    }),
    onSubmit: () => {
      // console.log('hace dispatch');
      
        dispatch(postNew(formik.values));
        
        setTimeout(()=>  window.location="/posts",1000);
      formik.resetForm();
    },
  });

  const { title,  urlImg, posts } = formik.values;

  // CARGAR IMAGEN
  const handleClickFile = () => {
    document.querySelector("#fileSelector").click();
  };
  const handleFileChange = async (e) => {
    // console.log(e);
    const file = e.target.files[0];
    if (file) {
      let fileURL = await dispatch(startUploadingImage(file));
      let urlImg = document.querySelector("#urlImage");
      urlImg.value = fileURL;
      formik.values.urlImg = fileURL;
    }
  };


  return (
    
    <div>

        <Title>Crear publicación</Title>

    <form onSubmit={formik.handleSubmit} className="card card-body border-primary py-4 px-5">
      
      <div className="form-group input-group mb-3">


        <div className="input-group-text bg-light">
          <i className="bi bi-person-square"></i>
        </div>

        <input
          type="text"
          name="title"
          placeholder="Titulo de la Publicación"
          className="form-control"
          value={title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </div>

      {formik.touched.title && formik.errors.title ? (
        <div className="text-danger mb-3">{formik.errors.title}</div>
      ) : null}

      <div className="form-group input-group col-lg-4 col-lg-offset-4">
        
        <input
          type="text"
          className="form-control center"
          placeholder="Imagen"
          name="urlImage"
          id="urlImage"
          value={urlImg}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled
          style={{ display: "none" }}
        />
      </div>

      <input
        id="fileSelector"
        type="file"
        name="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
        className="text-center"
      />
      <div className="d-flex justify-content-center">
      <div className="w-50 btn btn-primary p-0 my-2 text-uppercase fw-bold">
        <input
          type="button"
          className="btn text-white fw-bold text-center"
          value="Agregar Imagen"
          onClick={handleClickFile}
        />
      </div>
      </div>
      {formik.touched.urlImg && formik.errors.urlImg ? (
        <div className="text-danger mb-3">{formik.errors.urlImg}</div>
      ) : null}


      <div className="form-group mt-3">
        <textarea
          rows="3"
          className="form-control"
          placeholder="Escribe tu Publicacíon aqui"
          name="posts"
          value={posts}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        ></textarea>
      </div>

      {formik.touched.posts && formik.errors.posts ? (
        <div className="text-danger mb-3">{formik.errors.posts}</div>
      ) : null}

      <Button type="submit" className="btn btn-primary mt-3">
        Guardar Publicación
      </Button>
      
    </form>
    </div>
  


  );
 
}

export default AddPost;