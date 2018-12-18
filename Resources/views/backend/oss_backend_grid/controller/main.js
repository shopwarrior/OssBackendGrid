//{namespace name="backend/oss_backend_grid/controller/main"}
Ext.define('Shopware.apps.OssBackendGrid.controller.Main', {
    extend: 'Enlight.app.Controller',

    /**
     * all references to get the elements by the applicable selector
     */
    refs:[
        //grid will be available by me.getGrid() but after initialize
        { ref:'grid', selector:'oss-backend-grid-grid' },
        { ref:'orderGrid', selector:'oss-backend-grid-order-list' },
    ],

    init: function() {
        var me = this, events = {}, erpEvents = {}, controls = {};

        //Event name -> Event Handler
        events['oss-change-group'] = me.onChangeGroup;
        events['oss-sales-search'] = me.onSearchSales;
        events['oss-apply-search'] = me.onApplySearch;
        events['oss-selectionchange'] = me.onSelectionChange;

        //Grid -> { Event name -> Event Handler }
        controls['oss-backend-grid-grid'] = events;

        me.control(controls);

        me.mainWindow = me.getView('main.Window').create({ }).show();


        me.callParent(arguments);
    },

    /**
     * Event listener function of the { @link Shopware.grid.Panel:createSearchField }
     * The event is fired when the user insert a search string into the grid toolbar.
     * The search field can be enabled or disabled over the { @link Shopware.grid.Panel:searchField } property.
     *
     * @param grid { Shopware.grid.Panel }
     * @param searchField { Ext.form.field.Text }
     * @param value { String }
     * @returns { boolean }
     */
    onChangeGroup: function (grid, searchField, value) {
        var me = this, store = grid.getStore();

        if (store.filters.containsKey('customerGroup')) {
            store.filters.removeAtKey('customerGroup');
        }

        //scroll the store to first page
        store.currentPage = 1;

        store.filters.add('customerGroup', Ext.create('Ext.util.Filter', { property: 'customerGroup', value: value }));
        store.filter();

        return true;
    },

    onSelectionChange: function(selectionModel, selected, eOpts) {
        var me = this,
            positionGrid = me.getOrderPositionGrid(),
            receiptStore = Ext.create('Ext.data.Store', { model: 'Shopware.apps.Order.model.Receipt' }),
            positionStore = Ext.create('Ext.data.Store', { model: 'Shopware.apps.Order.model.Position' }),
            receiptGrid = me.getOrderReceiptGrid(),
            record = null;

        if (Ext.isArray(selected)) {
            record = selected[selected.length-1];
        } else {
            record = selected;
        }

        if (record instanceof Ext.data.Model && record.getReceipt() instanceof Ext.data.Store) {
            receiptStore = record.getReceipt();
        }
        if (record instanceof Ext.data.Model && record.getPositions() instanceof Ext.data.Store) {
            positionStore = record.getPositions();
        }

        receiptGrid.reconfigure(receiptStore);
        positionGrid.reconfigure(positionStore);

    },

    /**
     * Event listener method which is fired when the user insert a search string
     * into the search field which displayed on top of the order list.
     *
     * @param grid { Shopware.grid.Panel }
     * @param searchField { Ext.form.field.Text }
     * @param value { String }
     * @returns { boolean }
     */
    onSearchSales: function (grid, searchField, value) {
        var me = this, store = grid.getStore();

        if (store.filters.containsKey('search')) {
            store.filters.removeAtKey('search');
        }
        store.filters.add('search', Ext.create('Ext.util.Filter', { property: 'search', value: Ext.String.trim(value) }));

        //scroll the store to first page
        store.currentPage = 1;

        store.filter();
    },

    /**
     * Event listener method which is fired when the user insert a search string
     * into the search field which displayed on top of the order list.
     *
     * @param grid { Shopware.grid.Panel }
     * @param fromDate { String }
     * @param toDate { String }
     * @returns { boolean }
     */
    onApplySearch: function (grid, fromDate, toDate) {
        var me = this, store = grid.getStore();

        if (store.filters.containsKey('fromDate')) {
            store.filters.removeAtKey('fromDate');
        }
        if (store.filters.containsKey('toDate')) {
            store.filters.removeAtKey('toDate');
        }

        store.filters.add('fromDate', Ext.create('Ext.util.Filter', { property: 'fromDate', value: fromDate }));
        store.filters.add('toDate', Ext.create('Ext.util.Filter', { property: 'toDate', value: toDate }));

        //scroll the store to first page
        store.currentPage = 1;

        store.filter();
    }
});