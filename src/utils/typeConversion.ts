// Utility functions to convert between backend ObjectId types and frontend string types

export const convertBackendToFrontend = {
  // Convert backend ITenant to frontend ITenant
  tenant: (backendTenant: any): any => {
    if (!backendTenant) return null;
    return {
      ...backendTenant,
      _id: backendTenant._id?.toString() || backendTenant._id,
      userId: backendTenant.userId?.toString() || backendTenant.userId,
      searchHistory:
        backendTenant.searchHistory?.map((id: any) => id?.toString() || id) ||
        [],
      savedProperties:
        backendTenant.savedProperties?.map((id: any) => id?.toString() || id) ||
        [],
    };
  },

  // Convert backend OptimizationResult to frontend OptimizationResult
  optimizationResult: (backendResult: any): any => {
    if (!backendResult) return null;
    return {
      ...backendResult,
      matches:
        backendResult.matches?.map((match: any) => ({
          ...match,
          propertyId: match.propertyId?.toString() || match.propertyId,
          tenantId: match.tenantId?.toString() || match.tenantId,
        })) || [],
    };
  },

  // Convert backend PropertyMatch to frontend PropertyMatch
  propertyMatch: (backendMatch: any): any => {
    if (!backendMatch) return null;
    return {
      ...backendMatch,
      propertyId:
        backendMatch.propertyId?.toString() || backendMatch.propertyId,
      tenantId: backendMatch.tenantId?.toString() || backendMatch.tenantId,
    };
  },

  // Convert backend IMessage to frontend IMessage
  message: (backendMessage: any): any => {
    if (!backendMessage) return null;
    return {
      ...backendMessage,
      _id: backendMessage._id?.toString() || backendMessage._id,
      fromUserId:
        typeof backendMessage.fromUserId === 'object'
          ? backendMessage.fromUserId
          : backendMessage.fromUserId?.toString() || backendMessage.fromUserId,
      toUserId:
        typeof backendMessage.toUserId === 'object'
          ? backendMessage.toUserId
          : backendMessage.toUserId?.toString() || backendMessage.toUserId,
      propertyId:
        typeof backendMessage.propertyId === 'object'
          ? backendMessage.propertyId
          : backendMessage.propertyId?.toString() || backendMessage.propertyId,
    };
  },

  // Convert backend IViewing to frontend IViewing
  viewing: (backendViewing: any): any => {
    if (!backendViewing) return null;
    return {
      ...backendViewing,
      _id: backendViewing._id?.toString() || backendViewing._id,
      tenantId:
        typeof backendViewing.tenantId === 'object'
          ? backendViewing.tenantId
          : backendViewing.tenantId?.toString() || backendViewing.tenantId,
      landlordId:
        typeof backendViewing.landlordId === 'object'
          ? backendViewing.landlordId
          : backendViewing.landlordId?.toString() || backendViewing.landlordId,
      propertyId:
        typeof backendViewing.propertyId === 'object'
          ? backendViewing.propertyId
          : backendViewing.propertyId?.toString() || backendViewing.propertyId,
    };
  },

  // Convert backend IProperty to frontend IProperty
  property: (backendProperty: any): any => {
    if (!backendProperty) return null;
    let landlordId = backendProperty.landlordId;
    if (typeof landlordId === 'object' && landlordId !== null) {
      landlordId = landlordId._id || landlordId.id || '';
    }
    return {
      ...backendProperty,
      _id: backendProperty._id?.toString() || backendProperty._id,
      landlordId: landlordId?.toString() || '',
    };
  },

  // Convert backend IUser to frontend IUser
  user: (backendUser: any): any => {
    if (!backendUser) return null;
    return {
      ...backendUser,
      _id: backendUser._id?.toString() || backendUser._id,
    };
  },
};

// Generic function to convert any backend response
export const convertApiResponse = <T>(response: any): T => {
  if (!response || typeof response !== "object") return response;

  // Handle arrays
  if (Array.isArray(response)) {
    return response.map((item) => convertApiResponse(item)) as T;
  }

  // Handle objects with _id (likely a model)
  if (response._id) {
    const converted: any = { ...response };

    // Convert _id to string
    if (
      response._id &&
      typeof response._id === "object" &&
      response._id.toString
    ) {
      converted._id = response._id.toString();
    }

    // Convert other ObjectId fields
    const objectIdFields = [
      "userId",
      "tenantId",
      "landlordId",
      "propertyId",
      "fromUserId",
      "toUserId",
    ];
    objectIdFields.forEach((field) => {
      if (
        response[field] &&
        typeof response[field] === "object" &&
        response[field].toString
      ) {
        converted[field] = response[field].toString();
      }
    });

    // Convert arrays of ObjectIds
    const arrayFields = ["searchHistory", "savedProperties"];
    arrayFields.forEach((field) => {
      if (Array.isArray(response[field])) {
        converted[field] = response[field].map((item: any) =>
          item && typeof item === "object" && item.toString
            ? item.toString()
            : item
        );
      }
    });

    return converted as T;
  }

  // Recursively convert nested objects
  const converted: any = {};
  for (const [key, value] of Object.entries(response)) {
    converted[key] = convertApiResponse(value);
  }

  return converted as T;
};
