Ext.define('Shopware.apps.OssBackendGrid.model.Main', {
    extend: 'Shopware.data.Model',

    configure: function() {
        return {
            controller: 'OssBackendGrid'
        };
    },

    /**
     * to upload all selected items in one request
     * @boolean
     */
    batch:true,

    fields: [
        { name : 'id', type: 'int' },
        { name : 'orderId', type: 'int' },
        { name : 'customerId', type: 'int' },
        { name : 'total', type: 'int' },
        { name : 'group', type: 'string'},
        { name : 'customerBilling', type: 'string'},
        { name : 'customerNumber', type: 'string'},
        { name : 'amountNet', type: 'float' }
    ]
});

