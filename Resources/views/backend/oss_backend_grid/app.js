Ext.define('Shopware.apps.OssBackendGrid', {
    extend: 'Enlight.app.SubApplication',
    name:'Shopware.apps.OssBackendGrid',
    loadPath: '{url action=load}',
    bulkLoad: true,

    controllers: [ 'Main' ],

    views: [
        'main.Window',

        'list.List',
        'list.OrderList'
    ],

    models: [
        'Main',
        'Order'
    ],
    stores: [
        'Main',
        'Order'
    ],

    launch: function() {
        return this.getController('Main').mainWindow;
    }
});