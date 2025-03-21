interface ImageGenerationResponse {
  status: "success";
  data: {
    description: string;
    image_url: string;
    storage_path: string;
  };
}

interface ImageResponse {
  status: "success";
  data: {
    id: number;
    content_id: string;
    storage_path: string;
    generated_description: string;
    created_at: string;
    image_url: string;
    is_current: boolean;
    url: string;
  };
}

interface ImagesListResponse {
  status: "success";
  data: Array<{
    id: number;
    content_id: string;
    storage_path: string;
    generated_description: string;
    created_at: string;
    image_url: string;
    is_current: boolean;
    url: string;
  }>;
}



export async function generateImage(
  content: string
): Promise<ImageGenerationResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_IMAGE_SERVICE_URL}/images/generate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to generate image");
  }

  return response.json();
}

export async function saveContentImage(
  contentId: string,
  data: {
    storage_path: string;
    description: string;
    image_url: string;
  }
): Promise<ImageResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_IMAGE_SERVICE_URL}/images/content/${contentId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to save image");
  }

  return response.json();
}

export async function getCurrentImage(
  contentId: string
): Promise<ImageResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_IMAGE_SERVICE_URL}/images/content/${contentId}/current`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch current image");
  }

  return response.json();
}


export async function getContentImages(
  contentId: string
): Promise<ImagesListResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_IMAGE_SERVICE_URL}/images/content/${contentId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch images");
  }

  return response.json();
}

export async function deleteImage(
  imageId: number
): Promise<{ status: "success"; message: string }> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_IMAGE_SERVICE_URL}/images/${imageId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete image");
  }

  return response.json();
}
