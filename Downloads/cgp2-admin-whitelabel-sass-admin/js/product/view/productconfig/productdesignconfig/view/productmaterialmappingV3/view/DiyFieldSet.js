/**
 * Created by nan on 2020/3/30.
 * 一个可以通过title上的删除图标进行删除的fieldSet
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.DiyFieldSet', {
    extend: 'Ext.form.FieldSet',
    collapsible: true,
    header: false,
    margin: '10 50 50 50',
    defaultType: 'displayfield',
    profileStore: null,//所有能使用的profile,若没有则隐藏
    layout: 'fit',
    style: {
        padding: '10 25 10 25',
        borderRadius: '10px'
    },
    defaults: {
        width: '100%'
    },
    width: '90%',
    deleteCmp: null,
    productId: null,
    tipText: null,//提示文本
    collapsed: true,//初始时收缩状态
    clazz: null,//该fieldSet内容的clazz
    bomItem:null,
    title: i18n.getKey('condition'),
    constructor: function (config) {
        var me = this;
        if (config) {
            var tip = config.tipText || '';
            config.title = "<font size='2' style= ' color:green;font-weight: bold'>" + i18n.getKey(config.title) + '</font>'
            if (tip) {
                config.title += '<img  title="' + tip + '" style="cursor:pointer;margin:0 5px 4px 5px;vertical-align: middle;width:15px; height:15px" ' +
                    'src="' + path + 'ClientLibs/extjs/resources/themes/images/shared/fam/help.png' + '"/>';

            }
        }
        me.callParent(arguments);

    },
    initComponent: function () {
        var me = this;
        me.callParent();
        console.log(me.legend);

    },
    listeners: {
        afterrender: function (fieldSet) {
            console.log(fieldSet);
            fieldSet.legend.add(fieldSet.createDeleteCmp());
            fieldSet.legend.add(fieldSet.createHelpCmp());
        },
        expand: function () {
            var fieldSet = this;
            for (var i = 0; i < fieldSet.items.items.length; i++) {
                var item = fieldSet.items.items[i];
                if (item._grid) {
                    item._grid.getView().refresh()
                }
            }
            fieldSet.ownerCt.fireEvent('itemFieldSetExpand', fieldSet);
        }
    },
    isValid: function () {
        var me = this;
        var isValid = true;
        me.items.items.forEach(function (item) {
            if (item.rendered) {
                if (item.isValid() == false) {
                    isValid = false;
                }
            }
        });
        return isValid;
    },
    getValue: function () {
        var me = this;
        var result = {};
        me.items.items.forEach(function (item) {
            result[item.getName()] = item.getSubmitValue();
        });
        result.sourceBOMItemId = me.bomItem._id;
        result.clazz = me.clazz;
        return result;
    },
    setValue: function () {
        var me = this;
    },
    createDeleteCmp: function () {
        var me = this;
        me.deleteCmp = Ext.widget({
            xtype: 'image',
            height: 17,
            width: 17,
            style: 'cursor: pointer',
            type: 'close',
            qtip: '删除配置',
            src: path + 'ClientLibs/extjs/resources/themes/images/shared/fam/remove.png',
            listeners: {
                render: function (display) {
                    var fieldSet = display.ownerCt.ownerCt;
                    var container = fieldSet.ownerCt;
                    var imgEl = display.el; //获取到a元素的element封装对象
                    imgEl.on("click", function () {
                        Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (selector) {
                            if (selector == 'yes') {
                                //触发修改事件
                                var centerContainer = Ext.getCmp('productMaterialMappingV3_CenterContainer');
                                if (centerContainer) {
                                    centerContainer.fireEvent('dirty');
                                }
                                container.remove(fieldSet);
                            } else {

                            }
                        })
                    })
                }
            }
        });
        return me.deleteCmp;
    },
    createHelpCmp: function () {
        var me = this;
        me.deleteCmp = Ext.widget({
            xtype: 'image',
            height: 16,
            width: 16,
            style: 'cursor: pointer',
            type: 'help',
            qtip: '配置说明',
            src: path + 'ClientLibs/extjs/resources/themes/images/shared/fam/help.png',
            listeners: {
                render: function (display) {
                    var fieldSet = display.ownerCt.ownerCt;
                    var container = fieldSet.ownerCt;
                    var imgEl = display.el; //获取到a元素的element封装对象
                    imgEl.on("click", function () {
                        Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('是否查看配置说明?'), function (selector) {
                            if (selector == 'yes') {
                                //触发修改事件
                                JSOpen({
                                    id: 'configHelp',
                                    url: 'http://192.168.26.26:8080/file/file/67c0ca92a0842b66528cec0904663e22.jpg',
                                    title: '配置说明',
                                    refresh: true
                                })
                            } else {

                            }
                        })
                    })
                }
            }
        });
        return me.deleteCmp;
    },

})

