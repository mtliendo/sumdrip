import { Authenticator } from '@aws-amplify/ui-react'
import { useUserGroup } from '../hooks/useUserGroup'
import { useEffect, useState } from 'react'
import { Schema } from '../../amplify/data/resource'
import { generateClient } from 'aws-amplify/api'
import { StorageImage } from '@aws-amplify/ui-react-storage'
import { Link } from 'react-router'

const client = generateClient<Schema>()
function Catalog() {
	const { isInGroup: isStylist, isLoading } = useUserGroup('stylist')
	const [catalogs, setCatalogs] = useState<Schema['Catalog']['type'][]>([])

	useEffect(() => {
		async function fetchCatalogs() {
			const catalogs = await client.models.Catalog.list()
			setCatalogs(catalogs.data)
		}
		fetchCatalogs()
	}, [])

	return (
		<Authenticator>
			{isStylist && !isLoading && (
				<div className="container mx-auto px-4 py-8">
					<div className="flex justify-between items-center mb-8">
						<h1 className="text-3xl font-bold">Catalog Items</h1>
						<Link to="/catalog/new" className="btn btn-primary">
							Create New Catalog Item
						</Link>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{catalogs.map((catalog) => (
							<div key={catalog.id} className="card bg-base-100 shadow-xl">
								<figure>
									<StorageImage
										key={catalog.imageId}
										path={`resized/${catalog.imageId}`}
										alt={catalog.name}
										className="w-full h-64 object-cover"
									/>
								</figure>
								<div className="card-body">
									<h2 className="card-title">{catalog.name}</h2>
									<p>{catalog.description}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</Authenticator>
	)
}

export default Catalog
