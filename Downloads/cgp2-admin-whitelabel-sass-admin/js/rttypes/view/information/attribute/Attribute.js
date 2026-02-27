Ext.define("CGP.rttypes.view.information.attribute.Attribute", {
    extend: "Ext.grid.Panel",
    defaults: {
        width: 150
    },
    itemId: 'attribute',

    initComponent: function () {
        var me = this;

        me.title = i18n.getKey('attribute');
        var controller = Ext.create('CGP.rttypes.controller.Controller');
        me.store = Ext.create("CGP.rttypes.store.Attribute", {
            data: []
        });
        me.features = [{
            ftype:'grouping',
            groupHeaderTpl: [
                    i18n.getKey('attributeType')+'：',
                '<span style="color:red;">{name:this.belongsToParent}</span>',
                ' ',
                {
                    belongsToParent: function(name) {
                        if(name === true){
                            return '父属性'
                        }else{
                            return '自有属性'
                        }
                    }
                }
            ]

        }],
        me.columns = [
            {
                xtype: 'actioncolumn',
                itemId: 'actioncolumn',
                sortable: false,
                resizable: false,
                width: 70,
                menuDisabled: true,
                dataIndex: 'belongsToParent',
                items: [
                    {
                        iconCls: 'icon_edit icon_margin',
                        tooltip: i18n.getKey('update'),
                        isDisabled: function() {
                          return arguments[4].get('belongsToParent');
                        },
                        handler: function (view, rowIndex, colIndex, a, b, record) {
                            var isEdit = record.get('belongsToParent');
                            if(isEdit){
                                Ext.Msg.alert('提示','此为父属性，不允许删除和修改！');
                            }else{
                                var store = me.getStore();
                                var editOrNew = 'modify';
                                var data = me.allAttributeStore.getById(record.get('rtAttributeDef')['_id']);
                                var attributeMsg = '编号：' + data.get('_id') + '\n' + '名称：' + data.get('name') + '\n' + '代码：' + data.get('code');
                                record.attributeMsg = attributeMsg;
                                controller.editAttribute(store, record, editOrNew);
                            }

                        }
                    },
                    {
                        iconCls: 'icon_remove icon_margin',
                        itemId: 'actiondelete',
                        tooltip: i18n.getKey('remove'),
                        isDisabled: function() {
                            return arguments[4].get('belongsToParent');
                        },
                        handler: function (view, rowIndex, colIndex, a, b, record) {
                            var isEdit = record.get('belongsToParent');
                            if(isEdit){
                                Ext.Msg.alert('提示','此为父属性，不允许删除和修改！');
                            }else{
                                var store = view.getStore();
                                store.removeAt(rowIndex);
                            }
                        }
                    },{
                        iconCls: 'icon_query icon_margin',
                        itemId: 'actionquery',
                        tooltip: i18n.getKey('check')+i18n.getKey('attribute'),
                        handler: function (view, rowIndex, colIndex, a, b, record) {
                            JSOpen({
                                id: "rtattribute_edit",
                                url: path + 'partials/rtattribute/edit.html?id=' + record.get('attributeDefId'),
                                title: '修改_rtattribute',
                                refresh: true
                            });
                        }
                    }
                ]
            },
            {
                dataIndex: 'rtAttributeDef',
                text: i18n.getKey('rtAttributeDef'),
                width: 350,
                itemId: 'rtAttributeDef',
                renderer: function (value, metaData, record) {
                    var data = me.allAttributeStore.getById(value['_id']);
                    var msg = '编号：' + data.get('_id') + '<br>' + '名称：' + data.get('name') + '<br>' + '代码：' + data.get('code');
                    metaData.tdAttr = 'data-qtip="' + msg + '"';
                    return msg;
                }
            },{
                dataIndex: 'depth',
                text: i18n.getKey('depth'),
                width: 200,
                itemId: 'depth'
            },
            {
                dataIndex: 'sortOrder',
                text: i18n.getKey('sortOrder'),
                width: 200,
                itemId: 'sortOrder'
            },
            {
                dataIndex: 'belongsToParent',
                text: i18n.getKey('belongToParent'),
                width: 200,
                itemId: 'belongsToParent'
            }
        ];
        me.tbar = [
            {
                xtype: 'button',
                text: i18n.getKey('addAttribute'),
                handler: function () {
                    var grid = this.ownerCt.ownerCt;
                    var editOrNew = 'add';
                    var filterData = grid.getStore().data.items;
                    controller.editAttribute(grid.getStore(), null, editOrNew,filterData);
                }
            }
        ];
        me.callParent(arguments);
        me.content = me;
    },
    getValue: function () {
        var me = this;
        var attributes = [];
        me.store.data.items.forEach(function (item) {

            var attributeData = item.data;
            var belongsToParent = attributeData.belongsToParent;

            if(!belongsToParent){
                attributes.push(attributeData);
            }
        });
        return attributes;
    },

    refreshData: function (record) {

        var me = this;
        var store = me.getStore();
        store.removeAll();
        var attributesToRtTypes = record.get('attributesToRtTypes');
        store.add(attributesToRtTypes);
    }

})