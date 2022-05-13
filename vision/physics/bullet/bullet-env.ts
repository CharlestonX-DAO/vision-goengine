



// Wasm Memory Page Size is 65536
export const pageSize = 65536; // 64KiB

// How many pages of the wasm memory
// TODO: let this can be canfiguable by user.
export const pageCount = 250;

// How mush memory size of the wasm memory
export const memorySize = pageSize * pageCount; // 16 MiB

// The import function used in c++ code, same as DLL Import
export const importFunc = {
    syncPhysicsToGraphics (id: number) {
        const bt = globalThis.Bullet;
        const body = bt.CACHE.getWrapper(id, bt.BODY_CACHE_NAME);
        body.syncPhysicsToGraphics();
    },
};
