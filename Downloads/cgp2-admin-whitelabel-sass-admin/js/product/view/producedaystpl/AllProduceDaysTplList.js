Ext.define("CGP.product.view.producedaystpl.AllProduceDaysTplList", {
    extend: 'CGP.common.commoncomp.QueryGrid',


    constructor: function (config) {
        var me = this;

        me.callParent(arguments);

    },
    minWidth: 300,
    height: 400,

    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.product.controller.Controller');
        var store = Ext.create('CGP.product.view.producedaystpl.ProduceDaysTplStore',{
            /*filters: [
                function(item) {
                    return item.id != 0;
                }
            ]*/
        });
        store.filter([
            {filterFn: function(item) { return item.get("id") != me.allProductDaysTplWin.filterId; }}
        ]);
        me.gridCfg= {
            store: store,
            editAction: false,
            selType: 'rowmodel',
            deleteAction: false,
            pagingBar: false,
            plugins: [{
                ptype: 'rowexpander',
                rowBodyTpl: new Ext.XTemplate(
                    '<div id="produceDays-template-rule-content-{id}"></div>'
                )
            }],
            columns: [{
                text: i18n.getKey('id'),
                itemId: 'produceDaysTplId',
                dataIndex: 'id'
            }, {
                text: i18n.getKey('name'),
                itemId: 'produceDaysTplName',
                dataIndex: 'name'
            },{
                text: i18n.getKey('description'),
                itemId: 'description',
                dataIndex: 'description'
            },{
                text: i18n.getKey('sortOrder'),
                itemId: 'sortOrder',
                width: 380,
                dataIndex: 'sortOrder'
            },{
                xtype: 'componentcolumn',
                itemId: "choice",
                width: 90,
                tdCls: 'vertical-middle',
                sortable: false,
                renderer:function(value, metaData, record, rowIndex){
                    var id = record.get('id');
                    return new Ext.button.Button({
                        text: i18n.getKey('choice'),
                        itemId: 'choice',
                        handler: function () {
                            controller.modifyProductProduceDaystpl(me.allProductDaysTplWin,id);
                        }

                    });

                }
            }],
            viewConfig: {
                listeners: {
                    expandBody: function(rowNode, record, expandRow) {

                        controller.expandBody(rowNode, record, expandRow);
                    }
                }
            }
        };
        me.filterCfg = {
            minHeight: 90,
            items: [{
                name: 'id',
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('id'),
                itemId: 'idSearchField'
            },{
                name: 'name',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                itemId: 'nameSearchField'
            },{
                name: 'description',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('description'),
                itemId: 'descriptionSearchField'
            } ]
        };
        me.callParent(arguments);
    }
});
