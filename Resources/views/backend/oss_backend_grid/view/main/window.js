//{namespace name="backend/oss_backend_grid/window/main"}
Ext.define('Shopware.apps.OssBackendGrid.view.main.Window', {
    /**
     * Extends the Enlight.app.Window
     * @string
     */
    extend : 'Enlight.app.Window',
    /**
     * Alias
     * @string
     */
    alias : 'widget.oss-backend-grid-window',
    border: false,
    layout: 'border',

    /**
     * Title of the Edit Window
     * @string
     */
    title : '{s name=mtitle}Backend Grid Example{/s}',

    /**
     * Use stateful
     * @boolean
     */
    stateful : true,
    /**
     * Id used for the stateful
     * @string
     */
    stateId: 'shopware-oss-backend-grid-window',
    /**
     * Width of the window
     * @string
     */
    width: '85%',

    /**
     * Height of the window
     * @string
     */
    height: '90%',

    /**
     * Object which are used in this component
     * @Object
     */
    snippets: {
        filter: {
            title: '{s name=list/filter/title}Total{/s}'
        }
    },

    /**
     * Initializes the component and builds up the main interface
     *
     * @return void
     */
    initComponent: function() {
        var me = this;

        me.subApp.getController('Main').listingStore = Ext.create('Shopware.apps.OssBackendGrid.store.Main');
        me.subApp.getController('Main').orderStore = Ext.create('Shopware.apps.OssBackendGrid.store.Order');

        me.items = [
            me.createListingGrid(),
            me.createPositionListingGrid()
        ];

        me.callParent(arguments);
    },

    /**
     * Creates the sidebar panel which shows the categories and filter elements
     * of the emotion module.
     *
     * @returns { Ext.panel.Panel } the sidebar panel which contains the categories and filters
     */
    createListingGrid: function() {
        var me = this;

        return me.listingGrid = Ext.create('Shopware.apps.OssBackendGrid.view.list.List',{
            store: me.subApp.getController('Main').listingStore,
            height: '64%',
            layout: {
                align: 'right'
            },
            region: 'north'
        });
    },

    /**
     * Creates the sidebar panel which shows the categories and filter elements
     * of the emotion module.
     *
     * @returns { Ext.panel.Panel } the sidebar panel which contains the categories and filters
     */
    createPositionListingGrid: function() {
        var me = this;

        return me.positionGrid = Ext.create('Shopware.apps.OssBackendGrid.view.list.OrderList',{
            store: me.subApp.getController('Main').orderStore,
            height: '35%',
            layout: {
                align: 'right'
            },
            region: 'south'
        });
    }
});