Ext.define("CGP.product.view.producedaystpl.ProduceDaysTplList", {
    extend: 'CGP.common.commoncomp.QueryGrid',


    minWidth: 300,
    height: 400,
    constructor: function (config) {
        var me = this;

        me.callParent(arguments);

    },

    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.product.controller.Controller');
        var store = Ext.create('Ext.data.Store', {
            fields: [
                {
                    name: 'id',
                    type: 'int',
                    useNull: true
                }, {
                    name: 'name',
                    type: 'string'
                }, {
                    name: 'description',
                    type: 'string'
                }, {
                    name: 'sortOrder',
                    type: 'int'
                }, {
                    name: 'rules',
                    type: 'array'
                }
            ],
            proxy: {
                type: 'uxrest',
                url: adminPath + 'api/admin/product/'+me.productId+'/produceDaysTemplate',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            },
            autoLoad: true
        });

        me.gridCfg= {
            store: store,
            editAction: false,
            selType: 'rowmodel',
            /*listeners: {
            afterload: function (p) {
                //controller.afterPageLoad(p);
                var store = p.getStore();
                var expander = p.plugins[0];
                var record = store.getAt(0);
                expander.toggleRow(0, record);
            }
        },*/
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
            height: 90,
            hidden:true,
            header: false,
            items: []
        };
        store.on('load',function(){
            var expander = me.down('grid').plugins[0]
            for (var i = 0; i < store.getCount(); i++) {
                var record = store.getAt(i);
                if(expander.recordsExpanded[record.internalId]){
                    expander.toggleRow(i, record);
                }
                else if (expander.recordsExpanded[record.internalId] == null) {
                        expander.toggleRow(i, record);
                    }

            }
        })
        me.callParent(arguments);

    }

});