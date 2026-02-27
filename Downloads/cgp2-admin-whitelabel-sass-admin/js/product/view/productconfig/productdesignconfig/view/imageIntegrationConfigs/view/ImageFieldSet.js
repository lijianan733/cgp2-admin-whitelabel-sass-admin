Ext.define('CGP.product.view.productconfig.productdesignconfig.view.imageIntegrationConfigs.view.ImageFieldSet', {
    extend: 'Ext.ux.form.field.UxFieldSet',
    alias: 'widget.imagefieldset',
    collapsible: true,
    header: false,
    msgTarget: 'none',
    clazz: null,
    defaultType: 'displayfield',
    autoScroll:false,
    data: null,//数据
    style: {
        padding: '10',
        borderRadius: '2px'
    },
    legendItemConfig: {
        disabledBtn: {
            hidden: true,
            disabled: true,
            isUsable: true,//初始化时，是否是禁用
        },
        deleteBtn: {
            hidden: true,
            disabled: true,
            isUsable: true,
        }
    },
    title: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('imagePageContentPaths') + '</font>',
    maxHeight: 600,
    type: 'unMerge',//unMerge,merge
    margin: 20,

    impressionData: null,//大版信息
    initComponent: function () {
        var me = this;
        me.extraButtons = {
            addBtn: {
                xtype: 'button',
                itemId: 'add',
                iconCls: 'icon_add',
                tooltip: '添加',
                margin: '-2 0 0 5',
                componentCls: 'btnOnlyIcon',
                handler: function (btn) {
                    me.add(me.addItem());
                }
            }
        },
            me.items = [];
        me.callParent();
    },

    isValid: function () {
        var me = this;
        var isValid = true;
        me.items.items.forEach(function (item) {
            if (item.rendered) {
                if (item.items.items[0].isValid() == false) {
                    isValid = false;
                }
            }
        });
        if (!me.allowBlank && me.getValue().length < 1) {
            isValid = false;
        }
        return isValid;
    },
    addItem: function (data) {
        var me = this;
        var pcspreprocessController = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.controller.Controller');
        var itemComp = Ext.create('Ext.form.FieldContainer', {
            layout: {
                type: 'table',
                columns: 2
            },
            items: [
                // {
                //     xtype: 'textfield',
                //     name: 'image',
                //     allowBlank: false,
                //     width: 300,
                //     value:data
                // },
                {
                    // name: 'selector',
                    xtype: 'jsonpathselector',
                    // fieldLabel: i18n.getKey('image'),
                    labelAlign: "right",
                    itemId: 'image',
                    rawData: pcspreprocessController.getPCSData(me.pmvtId),
                    value: data,
                },
                {
                    xtype: 'displayfield',
                    padding: '0 10 0 10 ',
                    itemId: 'delete',
                    value: '<img class="tag" title="点击进行清除数据" style="height:16px;width: 16px;cursor: pointer" src="' + path + 'ClientLibs/extjs/resources/themes/images/shared/fam/remove.png' + '">',
                    listeners: {
                        render: function (display) {
                            var a = display.el.dom.getElementsByTagName('img')[0]; //获取到该html元素下的a元素
                            var ela = Ext.fly(a); //获取到a元素的element封装对象
                            ela.on("click", function () {
                                var imgFieldSet = display.ownerCt.ownerCt;
                                imgFieldSet.remove(display.ownerCt);
                            });
                        }
                    }
                }
                // {
                //     xtype: 'button',
                //     iconCls: 'icon_remove',
                //     handler: function (btn) {
                //         var imgFieldSet = btn.ownerCt.ownerCt;
                //         imgFieldSet.remove(btn.ownerCt);
                //     }
                // }
            ]
        });
        return itemComp;
    },
    getValue: function () {
        var me = this;
        var result = [];
        var items = me.items.items;
        for (var i = 0; i < items.length; i++) {
            result.push(items[i].items.items[0].diyGetValue())
        }
        return result;
    },
    setValue: function (data) {
        var me = this;
        data.forEach(function (item) {
            me.add(me.addItem(item));
        })
    },
    listeners: {
        afterrender: function (comp) {
            if (comp.data.length>0) {
                comp.setValue(comp.data);
            } else if (!comp.allowBlank) {
                comp.add(comp.addItem(null));
            }
        },
        beforeremove:function (comp,deleteComp){
            if(!comp.allowBlank && comp.items.length==1){
                Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('至少保留一条数据!'));
                return false;
            }
        }
    }
})