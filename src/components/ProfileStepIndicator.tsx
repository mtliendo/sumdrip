import React from 'react'

type ProfileStepIndicatorProps = {
	currentStep: 'details' | 'photos'
}

const ProfileStepIndicator: React.FC<ProfileStepIndicatorProps> = ({
	currentStep,
}) => {
	return (
		<div className="flex justify-center mb-8">
			<ul className="steps">
				<li
					className={`step ${currentStep === 'details' || currentStep === 'photos' ? 'step-primary' : ''}`}
				>
					Style Details
				</li>
				<li
					className={`step ${currentStep === 'photos' ? 'step-primary' : ''}`}
				>
					Photos
				</li>
			</ul>
		</div>
	)
}

export default ProfileStepIndicator
