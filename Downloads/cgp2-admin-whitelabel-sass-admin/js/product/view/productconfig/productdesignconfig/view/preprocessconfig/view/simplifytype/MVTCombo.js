Ext.define('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.simplifytype.MVTCombo', {
    extend: 'Ext.form.field.GridComboBox',
    alias: ['widget.mvtcombo'],
    store: null,
    multiSelect: false,
    valueField: '_id',
    displayField: 'displayName',
    editable: false,
    matchFieldWidth: false,
    designId: null,

    initComponent: function () {
        var me = this;

        me.gridCfg = {
            store: me.store,
            width: 650,
            height: 280,
            selType: 'checkboxmodel',
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    xtype: 'componentcolumn',
                    renderer: function (value, matete, record) {
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#")>' + record.getId() + '</a>',
                            sourceConfigId: record.getId(),
                            listeners: {
                                render: function (display) {
                                    var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                    var ela = Ext.fly(a); //获取到a元素的element封装对象
                                    ela.on("click", function () {
                                        var designId = JSGetQueryString('designId');
                                        var productId = JSGetQueryString('productId');
                                        var productBomConfigId = JSGetQueryString('productBomConfigId');
                                        builderConfigTab.manageSourceConfig(designId, productBomConfigId, productId, display.sourceConfigId);
                                    });
                                }
                            }
                        };
                    }
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                },
                {
                    text: i18n.getKey('materialPath'),
                    dataIndex: 'materialPath',
                    flex: 1,
                    renderer: function (value, metadata, record) {
                        return value;
                    }
                },

            ],
            bbar: Ext.create('Ext.PagingToolbar', {
                store: me.store,
                displayInfo: true, // 是否 ? 示， 分 ? 信息
                displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                emptyMsg: i18n.getKey('noData')
            }),
            listeners: {
                beforedeselect: function (selModel, record, index) {

                }
            }
        };
        me.filterCfg= {
            height: 80,
                width: 480,
                layout: {
                type: 'column',
                    columns: 2
            },
            fieldDefaults: {
                labelAlign: 'right',
                    layout: 'anchor',
                    style: 'margin-right:20px; margin-top : 5px;',
                    labelWidth: 70,
                    width: 220,
            },
            items: [
                {
                    name: '_id',
                    xtype: 'textfield',
                    isLike: false,
                    fieldLabel: i18n.getKey('id'),
                    itemId: '_id'
                },
                {
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name'
                },
                // {
                //     xtype: 'combo',
                //     name: 'clazz',
                //     fieldLabel: i18n.getKey('config') + i18n.getKey('type'),
                //     itemId: 'clazz',
                //     editable: false,
                //     valueField: 'value',
                //     multiSelect: false,
                //     displayField: 'display',
                //     matchFieldWidth: false,
                //     store: Ext.create('Ext.data.Store', {
                //         fields: [
                //             'value', 'display'
                //         ],
                //         data: [
                //             {
                //                 value: 'com.qpp.cgp.domain.preprocess.config.RtObjectSourceConfig',
                //                 display: 'RtObjectSourceConfig'
                //             },
                //             {
                //                 value: 'com.qpp.cgp.domain.preprocess.config.PageContentSourceConfig',
                //                 display: 'PageContentSourceConfig'
                //             },
                //             {
                //                 value: 'com.qpp.cgp.domain.preprocess.config.PageContentTemplateSourceConfig',
                //                 display: 'PageContentTemplateSourceConfig'
                //             },
                //             {
                //                 value: 'com.qpp.cgp.domain.preprocess.config.StaticPageContentLibrarySourceConfig',
                //                 display: 'StaticPageContentLibrarySourceConfig'
                //             }
                //         ]
                //     })
                // },
                {
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('MVT') + i18n.getKey('type'),
                    itemId: 'mvtType',
                    editable: false,
                    valueField: 'value',
                    multiSelect: false,
                    displayField: 'display',
                    matchFieldWidth: false,
                    hidden:true,
                    // value:'PMVT',
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            'value', 'display'
                        ],
                        data: [
                            {
                                value: 'PMVT',
                                display: 'PMVT'
                            },
                            {
                                value: 'SMVT',
                                display: 'SMVT'
                            }
                        ]
                    }),
                    listeners:{
                        change:function (comp,newValue, oldValue){
                            if(newValue=='SMVT'){
                                me.store=smvtStore;
                            }
                            else{
                                me.store=mvtStore;
                            }
                        }
                    }
                },
                {
                    name: 'productConfigDesignId',
                    xtype: 'numberfield',
                    columnWidth: 0,
                    value: parseInt(me.designId)??-1,
                    hidden: true,
                    fieldLabel: i18n.getKey('designId'),
                    itemId: 'designId'
                }
            ]
        };
        me.callParent();
    },
    diyGetValue:function (){
        var myComp=this;
        var values=myComp.getValue();
        var realValues=[];
        for (var key in values){
            realValues.push({_id: key,clazz: values[key].clazz});
        }
        return realValues;
    },
    diySetValue:function (data){
        var myComp=this,values='';
        if(Ext.isArray(data)){
            values=data.map(function (item){
                return item._id;
            }).join(',');
        }
        else if(Ext.isObject(data)){
            values=data._id;
        }
        myComp.setSubmitValue(values);
    }
})