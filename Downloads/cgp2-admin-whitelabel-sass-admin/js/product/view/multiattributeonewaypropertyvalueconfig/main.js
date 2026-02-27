Ext.onReady(function () {
    // 用于下面的资源

    // 初始化资源


    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('productCompositeModels'),
        block: 'productattributeprofile',
        editPage: 'edit.html',
        gridCfg: {
            store: Ext.create('CGP.product.view.productattributeprofile.store.ProfileStore'),
            frame: false,
            columnDefaults: {
                autoSizeColumn: true
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    xtype: 'gridcolumn',
                    itemId: 'id',
                    sortable: true
                },
                {
                    text: i18n.getKey('inAttribute'),
                    dataIndex: 'inAttribute',
                    xtype: 'arraycolumn',
                    width: 360,
                    itemId: 'inAttribute',
                    sortable: false,
                    maxLineCount: 3,
                    renderer: function(value){
                        return value.name;
                    }
                },
                {
                    text: i18n.getKey('attributePropertyValue'),
                    dataIndex: 'attributePropertyValue',
                    xtype: 'arraycolumn',
                    width: 160,
                    maxLineCount: 3,
                    itemId: 'attributePropertyValue',
                    renderer:function(value){
                        return value.attribute.name+'：'+value.propertyName;
                    }
                },
                {
                    text: i18n.getKey('condition'),
                    dataIndex: 'condition',
                    width: 160,
                    xtype: 'arraycolumn',
                    itemId: 'condition',
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip=' + i18n.getKey('check') + i18n.getKey('condition');
                        var valueString = JSON.stringify(value, null, "\t");
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#" style="color: blue" )>' + i18n.getKey('condition') + '</a>',
                            listeners: {
                                render: function (display) {
                                    var a = display.el.dom.getElementsByTagName('a')[0];//获取到该html元素下的a元素
                                    var ela = Ext.fly(a);//获取到a元素的element封装对象
                                    ela.on("click", function () {
                                        var win = Ext.create("Ext.window.Window", {
                                            id: "condition",
                                            modal: true,
                                            layout: 'fit',
                                            title: i18n.getKey('condition'),
                                            items: [
                                                {
                                                    xtype: 'textarea',
                                                    fieldLabel: false,
                                                    width: 600,
                                                    height: 400,
                                                    value: valueString
                                                }
                                            ]
                                        });
                                        win.show();
                                    });
                                }
                            }
                        };
                    }
                }
            ]
        },
        // 搜索框
        filterCfg: {
            items: [
                {
                    id: 'idSearchField',
                    name: '_id',
                    xtype: 'textfield',
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id'
                },
                {
                    id: 'nameSearchField',
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name'
                },{
                    id: 'groupName',
                    name: 'groupName',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('group'),
                    itemId: 'groupName'
                }
            ]
        }
    });
});