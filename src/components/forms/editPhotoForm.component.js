import React, { useState } from 'react'

import CategoryFilters from './categoryFilters.component'
import '../../styles/components/forms/loginForm.style.scss'

import SubmitButton from '../buttons/standard_button.component'

import API from '../../axios.config'

export default function EditPhotoForm(props) {

    const [formcat, setFormcat] = useState()
    const [photoName, setPhotoName] = useState(props.location.state.data.name)
    const [photoID, setPhotoID] = useState(props.location.state.data.idNumber)
    const [photoLocation, setPhotoLocation] = useState(props.location.state.data.location)
    const [photoDescription, setPhotoDescription] = useState(props.location.state.data.description)

    const GetCategories = (array) => { 
        setFormcat(array)
    }

    const EditPhoto = event => {
      event.preventDefault()
      API.patch(`/photos/${props.match.params.id}`, {
          name: event.target.name.value,
          idNumber: event.target.idNumber.value,
          location: event.target.location.value,
          description: event.target.description.value,
          category: formcat,
          fileRef: "This is a fileRef."
      })
      .then(res => props.history.push("/search"))
      .catch(err =>console.log(err.response.data.errorMessage))  
  }

    const ChangeName = () => {
       setPhotoName(document.getElementById("changeName").value)
    }
    const ChangeID = () => {
      setPhotoID(document.getElementById("changeID").value)
   }
   const ChangeLocation = () => {
      setPhotoLocation(document.getElementById("changeLocation").value)
   }
   const ChangeDescription = () => {
      setPhotoDescription(document.getElementById("changeDescription").value)
   }

   const DeletePhoto = event => {
    event.preventDefault()
    API.delete(`/photos/${props.location.state.data._id}`)
    .then(res => {console.log(res)})
    .catch(err =>console.log(err.response.data.errorMessage))   
   }

    return (
        <div id="addPhotoFormContainer" className="formContainer">
            <h1 className="pageHeading" data-cy="addPhotoFormHeading">Edit Photo</h1>
            <form id="add" onSubmit={EditPhoto}>

                <div className="fieldset">
                    <label>Photo Name:</label>
                    <input type="text" name="name" id="changeName" value={photoName} onChange={ChangeName}/>
                </div>

                <div className="fieldset">
                    <label>ID Number:</label>
                    <input type="text" name="idNumber" id="changeID" value={photoID} onChange={ChangeID}/>
                </div>

                <div className="fieldset">
                    <label>Location:</label>
                    <input type="text" name="location" id="changeLocation" value={photoLocation} onChange={ChangeLocation}/>
                </div>

                <div className="fieldset">
                    <label>Description:</label>
                    <input type="text" name="description" id="changeDescription" value={photoDescription} onChange={ChangeDescription}/>
                </div>

                <div className="fieldset">
                    <CategoryFilters GetCategories={GetCategories} formcat={formcat}/>
                </div>

                <div className="fieldset">
                    <SubmitButton />
                    <button onClick={DeletePhoto}>Delete</button>
                </div>

            </form>
        </div>
    )
}