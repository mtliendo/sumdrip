import { Authenticator } from '@aws-amplify/ui-react'
import { FileUploader } from '@aws-amplify/ui-react-storage'
import { generateClient } from 'aws-amplify/api'
import { useState } from 'react'
import { Schema } from '../../amplify/data/resource'
import { useUserGroup } from '../hooks/useUserGroup'

const client = generateClient<Schema>()

function CatalogNew() {
	const [name, setName] = useState('')
	const [description, setDescription] = useState('')
	const [imageId, setImageId] = useState('')
	const { isInGroup: isStylist, isLoading } = useUserGroup('stylist')

	async function handleSubmit() {
		try {
			await client.models.Catalog.create({
				name,
				description,
				imageId,
			})
		} catch (error) {
			console.error(error)
		}
	}

	function handleUploadSuccess(result: { key?: string }) {
		if (result.key) {
			setImageId(result.key)
		}
	}

	return (
		<Authenticator>
			{isStylist && !isLoading && (
				<div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-8">
					<div className="container max-w-xl px-4">
						<div className="card bg-base-100 shadow-xl">
							<div className="card-body space-y-6">
								<h2 className="card-title text-2xl font-bold">
									Create New Catalog
								</h2>
								<div className="form-control w-full">
									<label className="text-base-content/70">Name</label>
									<input
										type="text"
										placeholder="Enter catalog name"
										className="input input-bordered w-full"
										name="name"
										value={name}
										onChange={(e) => setName(e.target.value)}
									/>
								</div>
								<div className="flex flex-col form-control w-full">
									<label className="text-base-content/70">Description</label>
									<textarea
										className="textarea textarea-bordered h-24"
										placeholder="Enter catalog description"
										name="description"
										value={description}
										onChange={(e) => setDescription(e.target.value)}
									></textarea>
								</div>
								<div className="form-control w-full">
									<label className="text-base-content/70">Upload Image</label>
									<div className="border-2 border-dashed border-base-300 rounded-lg p-6">
										<FileUploader
											path="stylist-images/catalog/"
											maxFileCount={1}
											acceptedFileTypes={['image/*']}
											onUploadSuccess={handleUploadSuccess}
										/>
									</div>
								</div>
								<div className="card-actions justify-end pt-2">
									<button
										className="btn btn-primary w-full sm:w-auto"
										onClick={handleSubmit}
									>
										Create Catalog
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</Authenticator>
	)
}

export default CatalogNew
