//{namespace name="backend/oss_backend_grid/window/position_list"}
Ext.define('Shopware.apps.OssBackendGrid.view.list.OrderList', {
    extend: 'Shopware.grid.Panel',
    alias:  'widget.oss-backend-grid-order-list',
    id: 'oss-backend-grid-order-list',

    snippets: {
        number: '{s name=number}Ordernumber{/s}',
        amount: '{s name=amount}Amount{/s}',
        amountNet: '{s name=amountNet}Amount NET{/s}'
    },

    configure: function() {
        var me = this;
        return {
            actionColumn: false,
            addButton: false,
            deleteButton: false,
            searchField: false,

            columns: {
                number: {
                    header: me.snippets.number,
                    flex:1,
                    editor: null
                },
                amount: {
                    header: me.snippets.amount,
                    flex:1,
                    editor: null
                },
                amountNet: {
                    header: me.snippets.amountNet,
                    flex:1,
                    editor: null
                },
                orderId: {
                    xtype: 'actioncolumn',
                    width:26,
                    items: [
                        {
                            action: 'edit',
                            cls: 'editBtn',
                            iconCls: 'sprite-pencil',
                            handler: function(view, rowIndex, colIndex, item, opts, record) {
                                Shopware.app.Application.addSubApplication({
                                    name: 'Shopware.apps.Order',
                                    action: 'detail',
                                    params: {
                                        orderId: record.get('orderId')
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

    /**
     * Setup the component
     */
    initComponent: function () {
        var me = this;

        me.callParent(arguments);
    },

    /**
     * Creates the grid selection model for checkboxes
     *
     * @return [Ext.selection.CheckboxModel] grid selection model
     */
    createSelectionModel: function () {
        var me = this;

        return null;
    },

    createToolbarItems: function () {
        var me = this;

        return [];
    }
});
