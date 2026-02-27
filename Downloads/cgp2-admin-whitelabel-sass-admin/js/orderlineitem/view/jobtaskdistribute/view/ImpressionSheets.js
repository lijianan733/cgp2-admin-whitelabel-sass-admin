/**
 * Created by admin on 2020/8/13.
 */
Ext.define('CGP.orderlineitem.view.jobtaskdistribute.view.ImpressionSheets', {
    extend: 'Ext.form.FieldSet',
    alias: 'widget.impressionsheet',
    collapsible: true,
    header: false,
    defaultType: 'displayfield',
    layout: 'fit',
    padding: '10',
    width: '100%',
    border: '0',
    style: {
        borderRadius: '10px'
    },
    deleteCmp: null,
    tipText: null,//提示文本
    collapsed: false,//初始时收缩状态
    legendHandles:['Delete'],//['Delete','Help']
    data:null,
    contentClass:'',
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
        var sheetStore=Ext.create("CGP.orderlineitem.view.jobtaskdistribute.store.SheetLocal");
        me.items=[
            {
                name: 'impressionSheets',
                //allowBlank: false,
                xtype: 'gridfield',
                //fieldLabel: i18n.getKey('impressionSheets'),
                itemId: 'impressionSheets',
                gridConfig:{
                    renderTo:'impressionSheetsGrid',
                    store: sheetStore,
                    maxHeight: 300,
                    width: 900,
                    columns: [
                        {xtype: 'rownumberer'},
                        {
                            text: i18n.getKey('id'),
                            dataIndex: '_id',
                            xtype: 'gridcolumn',
                            itemId: '_id',
                            sortable: true
                        },
                        {
                            text: i18n.getKey('sheetConfig')+'Id',
                            dataIndex: 'templateId',
                            xtype: 'gridcolumn',
                            itemId: 'templateId'
                        },
                        {
                            text: i18n.getKey('impressionConfig')+'Id',
                            dataIndex: 'impressionTemplateId',
                            xtype: 'gridcolumn',
                            itemId: 'impressionTemplateId'
                        },
                        {
                            text: i18n.getKey('type'),
                            dataIndex: 'type',
                            xtype: 'gridcolumn',
                            itemId: 'type',
                            width: 80
                        },
                        {
                            text: i18n.getKey('quantity'),
                            dataIndex: 'quantity',
                            xtype: 'gridcolumn',
                            itemId: 'quantity',
                            width: 80
                        },
                        {
                            text: i18n.getKey('emptyPlaceHolderFillStrategy'),
                            dataIndex: 'emptyPlaceHolderFillStrategy',
                            xtype: 'gridcolumn',
                            itemId: 'emptyPlaceHolderFillStrategy',
                            width: 80
                        },
                        {
                            text: i18n.getKey('fillStrategy'),
                            dataIndex: 'fillStrategy',
                            xtype: 'gridcolumn',
                            itemId: 'fillStrategy',
                            width: 80
                        },
                        {
                            text: i18n.getKey('placeHolder'),
                            dataIndex: 'placeHolders',
                            xtype: 'componentcolumn',
                            itemId: 'placeHolders',
                            width: 80,
                            renderer: function (value, metadata, record) {
                                if(value){
                                    var strValue=value.length;
                                    metadata.tdAttr = 'data-qtip="查看placeHolders"';
                                    return {
                                        xtype: 'displayfield',
                                        value: '<a href="#" id="click-placeHolder" style="color: blue">' + strValue + '</a>',
                                        listeners: {
                                            render: function (display) {
                                                var clickElement = document.getElementById('click-placeHolder');
                                                clickElement.addEventListener('click', function () {
                                                    var wind=Ext.create("Ext.window.Window",{
                                                        itemId: "placeHolders",
                                                        title: i18n.getKey('placeHolders'),
                                                        layout: 'fit',
                                                        items:[
                                                            Ext.create('CGP.orderlineitem.view.jobtaskdistribute.view.PlaceHolders',{
                                                                data:value
                                                            })
                                                        ]
                                                    });
                                                    wind.show();
                                                },false);
                                            }
                                        }
                                    }
                                }
                                else{
                                    return "";
                                }
                            }
                        },
                        {
                            text: i18n.getKey('sortOrder'),
                            dataIndex: 'sortOrder',
                            xtype: 'gridcolumn',
                            itemId: 'sortOrder',
                            width: 80
                        },
                        {
                            text: i18n.getKey('file')+i18n.getKey('md5'),
                            dataIndex: 'md5',
                            xtype: 'gridcolumn',
                            itemId: 'md5',
                            width:120,
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                return value;
                            }
                        },
                        {
                            text: i18n.getKey('impression')+i18n.getKey('ortOrder'),
                            dataIndex: 'impressionSortOrder',
                            xtype: 'gridcolumn',
                            itemId: 'impressionSortOrder',
                            width: 80
                        },
                        {
                            text: i18n.getKey('composingOrder'),
                            dataIndex: 'composingOrder',
                            xtype: 'gridcolumn',
                            itemId: 'composingOrder',
                            width: 80
                        },
                        {
                            text: i18n.getKey('file'),
                            dataIndex: 'file',
                            xtype: 'gridcolumn',
                            itemId: 'file',
                            flex:1,
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                return value;
                            }
                        }
                    ],
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: sheetStore,
                        disabledCls:'x-tbar-loading',
                        displayInfo: true, // 是否 ? 示， 分 ? 信息
                        displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                        //emptyMsg: i18n.getKey('noData'),
                        listeners:{//去掉刷新按钮
                            afterlayout : function(comp){
                                if(comp.rendered && comp.getComponent("refresh")){
                                    comp.getComponent("refresh").hide();
                                }
                            }
                        }
                    })
                }
            }
        ];
        me.callParent();
    },
    listeners: {
        afterrender: function (fieldSet) {
            var me=this;
            if (me.data) {
                me.setValue(me.data);
            }
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
            item.getValue(result);
        });
        return result;
    },
    setValue: function (data) {
        var me = this;
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            if(item.xtype=='gridfield'){
                item.setSubmitValue(data[item.name]);
            }
            else{
                item.setValue(data[item.name]);
            }
        })
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