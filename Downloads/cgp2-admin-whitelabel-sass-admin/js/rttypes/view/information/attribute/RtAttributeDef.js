Ext.define("CGP.rttypes.view.information.attribute.RtAttributeDef", {
    extend: "Ext.grid.Panel",
    defaults: {
        width: 150
    },
    itemId: 'rtAttributeDef',
    viewConfig: {
        enableTextSelection: true
    },
    hadModify: false,//是否被修改，添加
    initComponent: function () {
        var me = this;

        me.title = i18n.getKey('rtAttributeDef');
        var controller = Ext.create('CGP.rttypes.controller.Controller');
        me.store = Ext.create("CGP.rttypes.store.RtAttributeDef", {
            data: []
        });
        me.features = [
            {
                ftype: 'grouping',
                groupHeaderTpl: [
                    i18n.getKey('attributeType') + '：',
                    '<span style="color:red;">{name:this.belongsToParent}</span>',
                    ' ',
                    {
                        belongsToParent: function (name) {
                            if (name === true) {
                                return '父属性'
                            } else {
                                return '自有属性'
                            }
                        }
                    }
                ]

            }
        ];
        me.columns = [
            {
                xtype: 'actioncolumn',
                itemId: 'actioncolumn',
                sortable: false,
                resizable: false,
                width: 70,
                menuDisabled: true,
                tdCls: 'vertical-middle',
                dataIndex: 'belongsToParent',
                items: [
                  {
                        iconCls: 'icon_query icon_margin',
                        itemId: 'actionquery',
                        tooltip: i18n.getKey('check') + i18n.getKey('attribute'),
                        handler: function (view, rowIndex, colIndex, a, b, record) {
                            JSOpen({
                                id: "rtattribute_edit",
                                url: path + 'partials/rtattribute/edit.html?id=' + record.get('_id'),
                                title: '修改_rtattribute',
                                refresh: true
                            });
                        }
                    }, {
                        iconCls: 'icon_edit icon_margin',
                        tooltip: i18n.getKey('update'),
                        isDisabled: function () {
                            return arguments[4].get('belongsToParent');
                        },
                        handler: function (view, rowIndex, colIndex, a, b, record) {
                            var store = me.store;
                            var editOrNew = 'modify';
                            controller.modifyRtAttributeWin(record);
                        }
                    },
                    {
                        iconCls: 'icon_remove icon_margin',
                        itemId: 'actiondelete',
                        tdCls: 'vertical-middle',
                        tooltip: i18n.getKey('remove'),
                        isDisabled: function () {
                            return arguments[4].get('belongsToParent');
                        },
                        handler: function (view, rowIndex, colIndex, a, b, record) {
                            var grid = view.ownerCt;
                            var isEdit = record.get('belongsToParent');
                            if (isEdit) {
                                Ext.Msg.alert('提示', '此为父属性，不允许删除和修改！');
                            } else {
                                var store = view.getStore();
                                store.removeAt(rowIndex);
                                grid.hadModify = true;
                            }
                        }
                    }
                ]
            },
            {
                text: i18n.getKey('id'),
                dataIndex: '_id',
                xtype: 'gridcolumn',
                itemId: '_id',
                tdCls: 'vertical-middle',
                sortable: true
            },
            {
                text: i18n.getKey('name'),
                dataIndex: 'name',
                xtype: 'gridcolumn',
                tdCls: 'vertical-middle',
                itemId: 'name',
                sortable: false
            },
            {
                text: i18n.getKey('code'),
                dataIndex: 'code',
                itemId: 'code',
                tdCls: 'vertical-middle',
                sortable: false
            },
            {
                dataIndex: 'required',
                text: i18n.getKey('required'),
                tdCls: 'vertical-middle',
                itemId: 'required'
            },
            {
                dataIndex: 'validationExp',
                text: i18n.getKey('validationExp'),
                tdCls: 'vertical-middle',
                itemId: 'validationExp'
            },
            {
                dataIndex: 'valueType',
                text: i18n.getKey('valueType'),
                tdCls: 'vertical-middle',
                itemId: 'valueType'
            },
            {
                dataIndex: 'valueDefault',
                text: i18n.getKey('valueDefault'),
                tdCls: 'vertical-middle',
                itemId: 'valueDefault'
            },
            {
                dataIndex: 'selectType',
                text: i18n.getKey('selectType'),
                tdCls: 'vertical-middle',
                itemId: 'selectType'
            },
            {
                dataIndex: 'arrayType',
                text: i18n.getKey('arrayType'),
                tdCls: 'vertical-middle',
                itemId: 'arrayType'
            },
            {
                dataIndex: 'customType',
                text: i18n.getKey('customType'),
                tdCls: 'vertical-middle',
                xtype: 'componentcolumn',
                itemId: 'customTypeId',
                renderer: function (value, metadata, record) {
                    metadata.tdAttr = 'data-qtip="查看RtType结构"';
                    if (value) {
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#")>' + value + '</a>',
                            listeners: {
                                render: function (display) {
                                    var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                    var ela = Ext.fly(a); //获取到a元素的element封装对象
                                    ela.on("click", function () {
                                        controller.showRtTypeHierarchy(value);

                                    });
                                }
                            }
                        };
                    }
                }
            },
            {
                dataIndex: 'depth',
                text: i18n.getKey('depth'),
                tdCls: 'vertical-middle',
                width: 200,
                itemId: 'depth'
            },
            {
                dataIndex: 'sortOrder',
                text: i18n.getKey('sortOrder'),
                tdCls: 'vertical-middle',
                width: 200,
                itemId: 'sortOrder'
            },
            {
                dataIndex: 'belongsToParent',
                text: i18n.getKey('belongToParent'),
                tdCls: 'vertical-middle',
                width: 200,
                itemId: 'belongsToParent'
            },
            {
                dataIndex: 'description',
                text: i18n.getKey('description'),
                tdCls: 'vertical-middle',
                itemId: 'description'
            },
            {
                text: i18n.getKey('options'),
                dataIndex: 'options',
                width: 200,
                xtype: 'arraycolumn',
                tdCls: 'vertical-middle',
                itemId: 'options',
                sortable: false,
                lineNumber: 2,
                renderer: function (value, metadata) {
                    metadata.tdAttr = 'data-qtip="' + value + '"';
                    metadata.style = "font-weight:bold";
                    return value['name'];
                }
            }
        ];
        me.tbar = [
            {
                xtype: 'button',
                text: i18n.getKey('add') + i18n.getKey('rtAttributeDef'),
                iconCls: 'icon_create',
                handler: function () {
                    var grid = this.ownerCt.ownerCt;
                    var editOrNew = 'add';
                    var filterData = grid.getStore().data.items;
                    controller.editAttribute(grid.getStore(), null, editOrNew, filterData, grid);
                }
            }
        ];
        me.callParent(arguments);
        me.content = me;
    },
    getValue: function () {
        var me = this;
        var attributesToRtTypes = [];
        me.store.data.items.forEach(function (item) {

            //var attributeData = item.data;
            var belongsToParent = item.data.belongsToParent;
            var attributesToRtType = {
                "_id": item.data['_id'],
                "idReference": "RtAttributeDef",
                "clazz": "com.qpp.cgp.domain.bom.attribute.RtAttributeDef"
            };

            if (!belongsToParent) {
                attributesToRtTypes.push({
                    rtAttributeDef: attributesToRtType,
                    sortOrder: item.data.sortOrder,
                    required: item.data.required
                });
            }
        });
        return attributesToRtTypes;
    },

    refreshData: function (record) {

        var me = this;
        var store = me.getStore();
        me.hadModify = false;
        store.removeAll();
        Ext.Ajax.request({
            url: adminPath + 'api/rtTypes/' + record.get('_id') + '/rtAttributeDefs',
            method: 'GET',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (res) {
                var responseMessage = Ext.JSON.decode(res.responseText);
                if (responseMessage.success == true) {
                    store.add(responseMessage.data);
                } else {
                    Ext.Msg.alert("提示", "请求错误:" + responseMessage.data.message);
                }

            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
        /*store.proxy.url = adminPath + 'api/rtTypes/'+record.get('_id')+'/rtAttributeDefs';
         var attributesToRtTypes = record.get('attributesToRtTypes');
         store.add(attributesToRtTypes);*/
    }

})
