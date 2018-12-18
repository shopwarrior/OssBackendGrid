Ext.define('Shopware.apps.OssBackendGrid.store.Order', {
    /**
     * Extends the standard Ext Model
     * @string
     */
    extend: 'Ext.data.Store',

    /**
     * Truthy to filter on the server side, otherwise falsy to filter on the client side.
     * @boolean
     */
    remoteFilter: false,

    /**
     * Auto load the store after the component
     * is initialized
     * @boolean
     */
    autoLoad : false,

    /**
     * Define the used model for this store
     * @string
     */
    model : 'Shopware.apps.OssBackendGrid.model.Order',

    proxy: {
        type: 'ajax',
        api: {
            read:'{url controller="OssBackendGrid" action="getOrders"}'
        },
        actionMethods: 'POST',
        reader: {
            type: 'json',
            root: 'data'
        },
        writer: {
            type: 'json',
            root: 'data'
        }
    }
});