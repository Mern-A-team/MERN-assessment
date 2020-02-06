import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import CategoryFilters from './categoryFilters.component'
import '../../styles/components/forms/loginForm.style.scss'

import SubmitButton from '../buttons/standard_button.component'

import API from '../../axios.config'

import S3 from 'react-s3'
import S3config from '../../s3-config'

export default function EditPhotoForm(props) {
	const [formcat, setFormcat] = useState()
	const [photoName, setPhotoName] = useState(props.location.state.data.name)
	const [photoID, setPhotoID] = useState(props.location.state.data.idNumber)
	const [photoLocation, setPhotoLocation] = useState(
		props.location.state.data.location
	)
	const [photoDescription, setPhotoDescription] = useState(
		props.location.state.data.description
	)
	const [errMessage, setErrMessage] = useState("");

	const GetCategories = array => {
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
			fileRef: props.location.state.data.fileRef
		})
			.then(res => {
				props.history.push(`/photo/${props.match.params.id}`)
			})
			.catch(err => setErrMessage(err.response.data.message))
	}

	const ChangeName = () => {
		setPhotoName(document.getElementById('changeName').value)
	}
	const ChangeID = () => {
		setPhotoID(document.getElementById('changeID').value)
	}
	const ChangeLocation = () => {
		setPhotoLocation(document.getElementById('changeLocation').value)
	}
	const ChangeDescription = () => {
		setPhotoDescription(document.getElementById('changeDescription').value)
	}

	const DeletePhoto = event => {
		event.preventDefault()

		S3.deleteFile(props.location.state.data.fileName, S3config)
			.then(res => {
				API.delete(`/photos/${props.location.state.data._id}`)
					.then(res => {
						RedirectDelete()
					})
					.catch(err => console.error(err.response.data.errorMessage))
			})
			.catch(err => console.error(err))
	}

	const RedirectDelete = () => {
		props.setPromptMessage("Photo has been deleted.")
		props.history.push(`/search`)
	}

	return (
		<div id='addPhotoFormContainer' className='formContainer'>
			<h1 className='pageHeading' data-cy='addPhotoFormHeading'>
				Edit Photo
			</h1>
			<form id='add' onSubmit={EditPhoto}>
			{ errMessage &&
					<p style={{color: "darkred"}}>{errMessage}</p>
				}
				<div className='fieldset'>
					<label>Photo Title:</label>
					<input
						type='text'
						name='name'
						id='changeName'
						value={photoName}
						onChange={ChangeName}
					/>
				</div>

				<div className='fieldset'>
					<label>ID Number:</label>
					<input
						type='text'
						name='idNumber'
						id='changeID'
						value={photoID}
						onChange={ChangeID}
					/>
				</div>

				<div className='fieldset'>
					<label>Location:</label>
					<input
						type='text'
						name='location'
						id='changeLocation'
						value={photoLocation}
						onChange={ChangeLocation}
					/>
				</div>

				<div className='fieldset'>
					<label>Description:</label>
					<input
						type='text'
						name='description'
						id='changeDescription'
						value={photoDescription}
						onChange={ChangeDescription}
					/>
				</div>

				<div className='fieldset'>
					<CategoryFilters GetCategories={GetCategories} formcat={formcat} />
				</div>

				<div className='fieldset'>
					<SubmitButton />
					{ props.userRole === "admin" &&
						<button onClick={DeletePhoto}>Delete</button>
					}
					<Link type="button" to={{pathname: `/photo/${props.location.state.data._id}`}}>Back to photo</Link>
				</div>
			</form>
		</div>
	)
}
