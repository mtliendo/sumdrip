import { useState, useEffect } from 'react'
import { fetchAuthSession } from 'aws-amplify/auth'

export function useUserGroup(groupName: string) {
	const [isInGroup, setIsInGroup] = useState(false)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		async function checkUserGroup() {
			try {
				const session = await fetchAuthSession()
				const groups =
					(session.tokens?.idToken?.payload['cognito:groups'] as string[]) || []
				setIsInGroup(groups.includes(groupName))
			} catch (error) {
				console.error('Error checking user group:', error)
				setIsInGroup(false)
			} finally {
				setIsLoading(false)
			}
		}

		checkUserGroup()
	}, [groupName])

	return { isInGroup, isLoading }
}
