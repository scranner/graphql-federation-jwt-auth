const sharedAuth = {
    authDirective: `
        directive @hasRoles(
           roles: [String],
        ) on FIELD_DEFINITION
    `,
    authResolver: async (next, src, args, context) => {
        const unauthorizedResult = () => {
            throw new Error("Not Authorized");
        };

        const requiredPermissions = args.roles;
        const userPermissions = context?.capabilities;

        if (!requiredPermissions || !userPermissions) {
            unauthorizedResult();
        }

        const hasRequiredPermissions = requiredPermissions.every(permission => userPermissions.includes(permission));

        if (!hasRequiredPermissions) {
            unauthorizedResult();
        }

        return await next()
    }
};

module.exports = { sharedAuth };