import createClient from "openapi-fetch"
import type { paths } from "../open-api-schema";
import { PreviewImageRequestDto, StudentResponseDto } from "../types";

const client = createClient<paths>({ baseUrl: "http://localhost:5258/api/" });

export async function updateStudentsPreviewImage(studentGuidId: string, image: string) {
    const { data } = await client.PUT('/api/Blob/UpdateStudentsPreviewImage', {
        body: {
            StudentGuidId: studentGuidId,
            Image: image
        }
    });

    if (!data) {
        console.error("updateStudentsPreviewImage: no data");
    }

    return data as StudentResponseDto;
}

export async function updateBundledStudentsPreviewImages(request: PreviewImageRequestDto[]) {
    const { data } = await client.PUT('/api/Blob/UpdateBundledStudentsPreviewImages', {
        body: {
            PreviewImageRequests: request
        }
    });

    if (!data) {
        console.error("updateBundledStudentsPreviewImages: no data");
    }

    return data as StudentResponseDto[];
}


// const {
//     data, // only present if 2XX response
//     error, // only present if 4XX or 5XX response
//   } = await client.GET("/blogposts/{post_id}", {
//     params: {
//       path: { post_id: "123" },
//     },
//   });
  
//   await client.PUT("/blogposts", {
//     body: {
//       title: "My New Post",
//     },
//   });