// const response = await fetch(`${apiParameters.endpointUrl}/api/templates`, {
//     headers: {'Authorization': `Bearer ${apiParameters.token()}` }
// });

// export const getToken = (): string => {
//     const jwtToken = document.cookie
//         .split('; ')
//         .find(c => c.includes('__session'))
//         ?.split('=')[1] || '';
//     return jwtToken
//   }

// import { apiEndpointParameters, EmailSendRequest } from "../util/types";

// emailRequest.file is a blob

// export async function postEmail(apiParameters: apiEndpointParameters, emailRequest: EmailSendRequest): Promise<void> {
//     const formData = new FormData();
//     formData.append('file', emailRequest.file);
//     formData.append('title', emailRequest.title);
//     formData.append('description', emailRequest.description);

//     const response = await fetch(`${apiParameters.endpointUrl}/api/Email/email-student/${emailRequest.guidId}`, {
//         headers: {Authorization: `Bearer ${apiParameters.token()}`},
//         method: 'POST',
//         body: formData,
//     });

//     if (response.status === 409)
//         throw new Error("Conflict");
//     if (response.status === 404)
//         throw new Error("Not Found");
//     if (response.status === 400) {
//         const errorData = await response.json();
//         throw new Error(errorData.message);
//     }
//     if (!response.ok) {
//         throw new Error('Error sending email');
//     }
// }