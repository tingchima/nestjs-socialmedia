const authResource = "auth";

const userResource = "users";

const channelResource = "channels";

const memberResource = "members";

const chatResource = "chats";

const signedUrlResource = "signed-url";

export const routesV1 = {
  name: "v1",
  auth: {
    root: authResource,
    create: `/${authResource}/token`,
    refresh: `/${authResource}/token/refresh`,
  },
  users: {
    root: userResource,
    create: `/${userResource}`,
    get: `/${userResource}/:id`,
    getMe: `/${userResource}/me`,
  },
  channels: {
    root: channelResource,
    create: `/${channelResource}`,
    get: `/${channelResource}/:id`,
  },
  members: {
    root: memberResource,
    create: `/${memberResource}`,
  },
  chats: {
    root: chatResource,
    create: `/${chatResource}`,
    get: `/${chatResource}/:id`,
    list: `/${chatResource}`,
    remove: `/${chatResource}/remove-multiple`,
    retract: `/${chatResource}/retract-multiple`,
    search: `/${chatResource}-search`,
  },
  signedUrl: {
    root: signedUrlResource,
    create: `/${signedUrlResource}`,
  },
};
