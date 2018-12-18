Ext.define('Shopware.apps.OssBackendGrid.model.Order', {
    extend: 'Shopware.data.Model',

    /**
     * The fields used for this model
     * @array
     */
    fields:[
        { name: 'orderId', type:'int' },
        { name: 'number', type:'string' },
        { name: 'amount', type:'float' },
        { name: 'amountNet', type:'float' }
    ]
});
