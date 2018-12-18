//{namespace name="backend/oss_backend_grid/window/list"}
Ext.define('Shopware.apps.OssBackendGrid.view.list.List', {
    extend: 'Shopware.grid.Panel',
    alias:  'widget.oss-backend-grid-grid',
    id: 'oss-backend-grid-grid',

    snippets: {
        toolbar: {
            group: 'Group:',
            from: 'From:',
            to: 'To:',
            filter: 'apply'
        },
        group: '{s name=group}Group{/s}',
        total: '{s name=total}Orders{/s}',
        customerNumber: '{s name=customerNumber}Customer{/s}',
        customerBilling: '{s name=customerBilling}Billing{/s}',
        amountNet: '{s name=amountNet}Amount NET{/s}'
    },

    configure: function() {
        var me = this;

        return {
            actionColumn: false,
            addButton: false,
            deleteButton: false,

            columns: {
                customerNumber: {
                    header: me.snippets.customerNumber,
                    width:100,
                    editor: null
                },
                group: {
                    header: me.snippets.group,
                    width:150,
                    editor: null
                },
                customerBilling: {
                    header: me.snippets.customerBilling,
                    flex:1,
                    editor: null
                },
                amountNet: {
                    header: me.snippets.amountNet,
                    flex:1,
                    editor: null
                },
                total: {
                    header: me.snippets.total,
                    flex:1,
                    editor: null
                },
                customerId: {
                    xtype: 'actioncolumn',
                    width:60,
                    items: [
                        {
                            action: 'edit',
                            cls: 'editBtn',
                            iconCls: 'sprite-pencil',
                            handler: function(view, rowIndex, colIndex, item, opts, record) {
                                Shopware.app.Application.addSubApplication({
                                    name: 'Shopware.apps.Customer',
                                    action: 'detail',
                                    params: {
                                        customerId: ~~(1 * record.get('customerId'))
                                    }
                                });
                            }
                        }
                    ],
                    renderer: me.openArticleColumn
                }
            }
        };
    },

    viewConfig: {
        enableTextSelection: true
    },

    /**
     * Creates the grid selection model for checkboxes
     *
     * @return [Ext.selection.CheckboxModel] grid selection model
     */
    createSelectionModel: function () {
        var me = this;

        return Ext.create('Ext.selection.CheckboxModel', {
            listeners: {
                beforeselect: function (selectionModel, record) {
                    var me   = this;

                    selectionModel.deselectAll();
                    // return false;
                },
                selectionchange: function(sm, selections) {
                    if(selections.length) {
                        var record = selections[0];
                        me.subApp.getController('Main').orderStore.getProxy().extraParams.customerId = record.get('customerId');
                        var store = me.subApp.getController('Main').listingStore;
                        me.subApp.getController('Main').orderStore.getProxy().extraParams.fromDate = null;
                        me.subApp.getController('Main').orderStore.getProxy().extraParams.toDate = null;
                        if (store.filters.items.length) {
                            store.filters.each(function (item) {
                                if (item.hasOwnProperty('value') && item.hasOwnProperty('property')) {
                                    if (item.property == 'fromDate') {
                                        me.subApp.getController('Main').orderStore.getProxy().extraParams.fromDate = item.value;
                                    }
                                    if (item.property == 'toDate') {
                                        me.subApp.getController('Main').orderStore.getProxy().extraParams.toDate = item.value;
                                    }
                                }
                            });
                        }
                        me.subApp.getController('Main').orderStore.load();
                    }
                }
            }
        });
    },

    /**
     * Setup the component
     */
    initComponent: function () {
        var me = this;

        me.callParent(arguments);
        me.store.load();
    },

    openArticleColumn: function() {
        var me               = this,
            actionColumItems = [];

        return '';
    },

    createToolbarItems: function () {
        var me = this;

        me.fromDate = Ext.create('Ext.form.field.Date', {
            fieldLabel: me.snippets.toolbar.from,
            name: 'from_date',
            width: 150,
            labelWidth: 40,
            maxValue: new Date(),
            submitFormat: 'Y-m-d',
            format: 'Y-m-d'
        });

        me.toDate = Ext.create('Ext.form.field.Date', {
            fieldLabel: me.snippets.toolbar.to,
            name: 'to_date',
            width: 140,
            labelWidth: 30,
            maxValue:  new Date(),
            format: 'Y-m-d',
            submitFormat: 'Y-m-d',
            value:  new Date()
        });

        var filterButton = Ext.create('Ext.button.Button', {
            text: me.snippets.toolbar.filter,
            cls: 'small secondary',
            scope : this,
            handler: function() {
                me.applyFilterEvent( me.fromDate.getValue(), me.toDate.getValue() );
            }
        });

        var items = [
            me.fromDate,
            {  'xtype': 'tbspacer', 'width': 3 },
            me.toDate,
            {  'xtype': 'tbspacer', 'width': 3 },
            filterButton,
            '->',
            me.createGroupSelect(),
            {  'xtype': 'tbspacer', 'width': 18 },
            me.createSearchField(),
            { xtype:'tbspacer', width:6 }
        ];

        return items;
    },

    createSearchField: function() {
        var me = this;
        me.searcfField = Ext.create('Ext.form.field.Text',
            {
                xtype:'textfield',
                name:'searchfield',
                cls:'searchfield',
                id: 'searchfieldSalesValoraId',
                width:175,
                emptyText: me.snippets.toolbar.search,
                enableKeyEvents:true,
                checkChangeBuffer:500,
                listeners: {
                    change: function(field, value) {
                        me.searchSalesEvent(field, value);
                    }
                }
            });

        return me.searcfField;
    },

    createGroupSelect: function() {
        var me = this;

        me.customerGroup = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: me.snippets.group,
            labelWidth: 40,
            width: 150,
            queryMode: 'local',
            store: Ext.create('Ext.data.Store', {
                fields: [
                    'value',
                    'text'
                ],
                data: [
                    {
                        "value": 0,
                        "text": 'All'
                    },
                    {
                        "value": "EK",
                        "text": 'Default'
                    },
                    {
                        "value": "H",
                        "text": 'Haendlers'
                    }
                ]
            }),
            displayField: 'text',
            valueField: 'value',
            listeners: {
                change: function(field, value)
                {
                    me.changecustomerGroup(field, value);
                }
            }
        });
        me.customerGroup.setValue(0);

        return me.customerGroup;
    },

    changecustomerGroup: function(field, value) {
        var me = this;

        me.fireEvent('oss-change-group', me, field, value);
    },

    searchSalesEvent: function(field, value) {
        var me = this;

        me.fireEvent('oss-sales-search', me, field, value);
    },

    applyFilterEvent: function(fromDate, toDate) {
        var me = this;

        me.fireEvent('oss-apply-search', me, fromDate, toDate);
    }
});
