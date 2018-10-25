class ResourceCollection extends Map {
    add(resource) {
        this.set(resource.getId(), resource);
    }

    sync(resources) {
        const resourcesToCreate = new ResourceCollection();
        const resourcesToRemove = new ResourceCollection();
        const resourcesToUpdate = new ResourceCollection();

        resources.forEach((resource, resourceId) => {
            if (this.has(resourceId)) {
                const existingResource = this.get(resourceId);

                if (!existingResource.equalTo(resource)) {
                    resourcesToUpdate.add(resource);
                }
            } else {
                resourcesToCreate.add(resource);
            }
        });

        this.forEach((resource, resourceId) => {
            if (!resources.has(resourceId)) {
                resourcesToRemove.add(this.get(resourceId));
            }
        });

        resourcesToRemove.remove();
        resourcesToUpdate.update();
        resourcesToCreate.create();
    }

    update() {
        this.forEach(resource => resource.update());
    }

    remove() {
        this.forEach(resource => resource.remove());
    }

    create() {
        this.forEach(resource => resource.create());
    }
}


module.exports = ResourceCollection;
