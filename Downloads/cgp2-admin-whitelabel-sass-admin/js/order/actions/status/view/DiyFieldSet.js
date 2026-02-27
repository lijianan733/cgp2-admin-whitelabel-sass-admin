Ext.define('Order.status.view.DiyFieldSet', {
    extend: 'Ext.form.FieldSet',
    requires:['CGP.materialviewtype.view.TreeField'],
    collapsible: true,
    header: false,
    margin: '10',
    padding: '10',
    defaultType: 'displayfield',
    layout: 'fit',
    style: {
        borderRadius: '5px'
    },
    defaults: {
        width: '100%'
    },
    width: '100%',
    deleteCmp: null,
    tipText: null,//提示文本
    collapsed: false,//初始时收缩状态
    legendHandles: ['Delete'],//['Delete','Help']
    data: null,
    contentClass: '',
    innerComps:null,
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
        me.items = [];
        me.callParent();
    },
    listeners: {
        afterrender: function (fieldSet) {
            // if (Ext.Array.contains(fieldSet.legendHandles, 'Delete')) {
            //     fieldSet.legend.add(fieldSet.createDeleteCmp());
            // }
            if (Ext.Array.contains(fieldSet.legendHandles, 'Help')) {
                fieldSet.legend.add(fieldSet.createHelpCmp());
            }
        },
        expand: function (fieldset) {
            var form = fieldset.ownerCt;
            if(fieldset.items.items.length<1){
                fieldset.add(fieldset.innerComps);
            }
            for (var i = 0; i < form.items.items.length; i++) {
                var item = form.items.items[i];
                if (item != fieldset && item.collapse) {
                    item.collapse();
                }
            }
            if(fieldset.data){
                fieldset.setValue(fieldset.data);
            }
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
            if(item.name=='userImpositionParams'){
                result[item.name]=item.getJsonObjectValue();
            }
            else{
                result[item.name]=item.getValue();
            }
        });
        return result;
    },
    setValue: function (data) {
        var me = this;
        me.items.items.forEach(function (item) {
            if(item.name=='userImpositionParams'){
                var paramsData={};
                paramsData['designType']=data.userParams;
                //有值使用当前值，无值使用默认值
                if(data.userParamDefaultValues&&data.userImpositionParams&&JSON.stringify(data.userImpositionParams) !='{}'){
                    data.userParamDefaultValues.objectJSON=data.userImpositionParams;
                }
                paramsData['predesignObject']=data.userParamDefaultValues;
                item.setSubmitValue(paramsData,true);
            }
            else{
                item.setValue(data[item.name]);
            }

        });
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
                        JSOpen({
                            id: 'configHelp',
                            url: 'helpPage',
                            title: '配置说明',
                            refresh: true
                        })
                    })
                }
            }
        });
        return me.deleteCmp;
    }

})

