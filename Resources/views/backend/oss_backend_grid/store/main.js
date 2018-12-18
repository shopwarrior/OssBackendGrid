Ext.define('Shopware.apps.OssBackendGrid.store.Main', {
    extend:'Shopware.store.Listing',
    /**
     * Amount of data loaded at once
     * @integer
     */
    pageSize:40,

    configure: function() {
        return {
            controller: 'OssBackendGrid'
        };
    },
    model: 'Shopware.apps.OssBackendGrid.model.Main'
});