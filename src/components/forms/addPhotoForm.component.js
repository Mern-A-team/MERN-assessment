import React, { useState } from 'react'
import CategoryFilters from './categoryFilters.component'
import '../../styles/components/forms/loginForm.style.scss'

import SubmitButton from '../buttons/standard_button.component'

import API from '../../axios.config'
import S3 from 'react-s3'
import S3config from '../../s3-config'

export default function EditCategoryForm(props) {
	const [formcat, setformcat] = useState()
	const [file, setFile] = useState(null)
	const [errMessage, setErrMessage] = useState()
	const [savePrompt, setSavePrompt] = useState()

	const onChangeFile = event => {
		setFile(event.target.files[0])
	}

	// API call to upload the photo and save the photo data.
	const uploadAndSave = event => {
		event.preventDefault()
		event.persist()
		// Upload function for S3.
		S3.uploadFile(file, S3config)
			.then(data => {
				API.post(`/photos/addPhoto`, {
					name: event.target.name.value,
					idNumber: event.target.idNumber.value,
					location: event.target.location.value,
					description: event.target.description.value,
					category: formcat,
					fileRef: data.location,
					fileName: data.key
				})
					.then(res => {
						setSavePrompt(res.data.message)
						// (`${res.config.data.name} has been saved!`)
					})
					// On error, console log the message.
					.catch(err => setErrMessage("Something went wrong."))
			})
			.catch(err => setErrMessage(err.message))
	}

	// This function is passed into the categories field to set the list there as the current formcat local variable.
	const GetCategories = array => {
		setformcat(array)
	}

	return (
		// Add Photo form render.
		<div id='addPhotoFormContainer' className='formContainer'>

			<h1 className='pageHeading' data-cy='addPhotoFormHeading'>
				Add Photo
			</h1>
			<form id='add' onSubmit={uploadAndSave}>
				{ errMessage &&
					<p style={{color: "darkred"}}>{errMessage}</p>
				}
				<div className='fieldset'>
					<label>Photo Title:</label>
					<input type='text' name='name' />
				</div>

				<div className='fieldset'>
					<label>ID Number:</label>
					<input type='text' name='idNumber' />
				</div>

				<div className='fieldset'>
					<label>Location:</label>
					<input type='text' name='location' />
				</div>

				<div className='fieldset'>
					<label>Description:</label>
					<input type='text' name='description' />
				</div>

				<div className='fieldset'>
					<label>Categories:</label>
					{/* Rendering the category filters component, passing in the GetCategories function and the current formcat variable. */}
					<CategoryFilters GetCategories={GetCategories} formcat={formcat} />
				</div>

				<div className='fieldset'>
					<label>Image Upload</label>
					{/* Calls onChangeFile when a file to upload has been selected. */}
					<input type='file' name='image' onChange={onChangeFile} />
				</div>

				<div className='fieldset'>
					<SubmitButton />
				</div>

				{savePrompt && 
					<p>{savePrompt}</p>
				}
			</form>
		</div>
	)
}
