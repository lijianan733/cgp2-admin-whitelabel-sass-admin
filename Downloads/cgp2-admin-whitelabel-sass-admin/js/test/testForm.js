Ext.Loader.syncRequire(['CGP.common.store.MaterialStore','Ext.ux.form.field.MultiCombo']);

Ext.onReady(function() {
    var materialStore = Ext.data.StoreManager.lookup('materialStore');
    var combo = {
        xtype: 'combo',
        valueField: '_id',
        displayField: 'name',
        //queryMode: 'remote',
        msgTarget: 'side',
        //pageSize: 25,
        listeners: {
            /*beforedeselect: function(combo,record){
                console.log(record)
            },*/

            change: function(combo){
                console.log('test')
            }
        },
        width: 450,
        allowBlank: false,
        store: materialStore,
        fieldLabel: 'combo',
        itemId: 'combo'
    };
    var searchProduct = function () {

        var queries = [];

        var items = this.ownerCt.items.items;

        var store = this.ownerCt.ownerCt.getStore();

        var params = {};

        for (var i = 0; i < items.length; i++) {
            var query = {};
            if (items[i].xtype == 'button')
                continue;
            if (Ext.isEmpty(items[i].value))
                continue;
            query.name = items[i].name;
            if(!Ext.isEmpty(items[i].isLike) && !items[i].isLike){
                query.value = items[i].getValue();
            }else if(Ext.isEmpty(items[i].isLike) || items[i].isLike){
                query.value = '%' + items[i].getValue() + '%'
            }
            query.type = 'string';
            queries.push(query);
        }

        if (queries.length > 0) {
            store.proxy.extraParams = {
                filter: Ext.JSON.encode(queries)
            }
        } else {
            store.proxy.extraParams = null;
        }

        store.loadPage(1);


    };
    var clearParams= function () {

        var items = this.ownerCt.items.items;
        var store = this.ownerCt.ownerCt.getStore();

        for (var i = 0; i < items.length; i++) {
            if (items[i].xtype == 'button')
                continue;
            if (Ext.isEmpty(items[i].value))
                continue;
            items[i].setValue('');
        }

        store.proxy.extraParams = null;


    };
    var singleCombo  = {
        name: "templateId",
        xtype : 'gridcombo',
        allowBlank : false,
        fieldLabel : i18n.getKey('fileName'),
        itemId :'templateId',
        displayField : 'name',
        valueField : '_id',
        editable:false,
        width: 350,
        isComboQuery: true,
        store : materialStore,
        listeners: {
            blur: function(){
                console.log('lost blur')
            },
            beforehide: function(comp){
                console.log('test')
            }
        },
        matchFieldWidth: false,
        multiSelect: false,
        autoScroll: true,
        gridCfg: {
            store : materialStore,
            height: 300,
            width: 600,
            autoScroll: true,
            //hideHeaders : true,
            columns: [{
                text: i18n.getKey('id'),
                width: 200,
                dataIndex: '_id',
                renderer : function(value, metaData){
                    metaData.tdAttr = 'data-qtip="' + "<div>"+value+"</div>"+ '"';
                    return value;
                }
            }, {
                text: i18n.getKey('name'),
                width: 200,
                dataIndex: 'name',
                renderer : function(value, metaData, record, rowIndex) {
                    metaData.style = 'color:gray';
                    metaData.tdAttr = 'data-qtip="' + "<div>"+value+"</div>"+ '"';
                    return value
                }
            }],
            tbar: {
                layout: {
                    type: 'column'
                },
                defaults: {
                    width: 170,
                    isLike: false,
                    padding: 2
                },
                items: [{
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('id'),
                    name: '_id',
                    isLike: false,
                    labelWidth: 40
                },{
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    name: 'name',
                    labelWidth: 40
                }, {
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('type'),
                    name: 'clazz',
                    itemId: 'clazz',
                    id: 'materialType',
                    valueField: 'value',
                    displayField: 'name',
                    store: Ext.create('Ext.data.Store',{
                        fields: ['name','value'],
                        data: [{
                            name: 'MaterialSpu',
                            value: 'com.qpp.cgp.domain.bom.MaterialSpu'
                        },{
                            name: 'MaterialType',
                            value: 'com.qpp.cgp.domain.bom.MaterialType'
                        }]
                    }),
                    labelWidth: 40
                }, /*{
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('category'),
                    name: 'category',
                    labelWidth: 40
                },*/ '->',{
                    xtype: 'button',
                    text: i18n.getKey('search'),
                    handler: searchProduct,
                    width: 80
                }, {
                    xtype: 'button',
                    text: i18n.getKey('clear'),
                    handler: clearParams,
                    width: 80
                }]
            },
            bbar: Ext.create('Ext.PagingToolbar', {
                store: materialStore,
                displayInfo: true, // 是否 ? 示， 分 ? 信息
                displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                emptyMsg: i18n.getKey('noData')
            })
        }
    };

    var defaultLanguage = {
        /*name: "templateId",
        xtype : 'gridcombo',
        allowBlank : false,
        fieldLabel : i18n.getKey('fileName'),
        itemId :'templateId',
        displayField : 'name',
        valueField : '_id',
        editable:false,
        width: 350,
        isComboQuery: true,
        store : materialStore,
        listeners: {
            blur: function(){
                console.log('lost blur')
            },
            beforehide: function(comp){
                console.log('test')
            }
        },
        matchFieldWidth: false,
        multiSelect: false,
        autoScroll: true,*/
        fieldLabel: i18n.getKey('default')+i18n.getKey('language'),
        store: materialStore,
        valueField: '_id',
        xtype: 'gridcombo',
        displayField: 'name',
        multiSelect : false,
        width : 380,
        allowBlank : false,
        forceSelection: true,
        labelWidth : 100,
        autoScroll: true,
        queryMode : 'remote',
        pickerAlign: 'bl',
        matchFieldWidth: false,
        gridCfg: {
            store: materialStore,
            height: 200,
            width:'100%',
            autoScroll: true,
            columns: [{
                text: i18n.getKey('name'),
                width: '50%',
                dataIndex: 'name'
            },{
                text: i18n.getKey('code'),
                width: '49%',
                dataIndex: 'code'
            }],
            bbar : Ext.create('Ext.PagingToolbar', {
                store : materialStore,
                displayInfo : true,
                displayMsg : '',
                emptyMsg : i18n.getKey('noData')
            })
        }
    };
    var  testArea = {
        xtype: 'textarea',
        fieldLabel:'textarea',
        resizable: true,
         dynamic: true,
         resizeHandles: 'se',
         target: 'dwrapped',
         pinned: true
        /*resizable: {
         target: this,
         dynamic: true,
         handles: 'e',
         pinned: true
         },*/
    };
    var textfield = {
        xtype: 'textfield',
        //width:350,
        minWidth: 350,
        fieldLabel: 'textfield',
        grow:true
    };
    var  testArea1 = {
        xtype: 'textarea',
        fieldLabel:'textarea',
        resizable: true,
        dynamic: true,
        resizeHandles: 'se',
        target: 'dwrapped',
        pinned: true
        /*resizable: {
         target: this,
         dynamic: true,
         handles: 'e',
         pinned: true
         },*/
    };
    var  testArea2 = {
        xtype: 'textarea',
        fieldLabel:'textarea',
        resizable: true,
        resizeHandles: 'se'
        /*resizable: {
         target: this,
         dynamic: true,
         handles: 'e',
         pinned: true
         },*/
    };

    var form = {
        xtype: 'form',
        //border: false,
        items: [textfield,testArea1,testArea,testArea2],
        region: 'center',
        tbar: [
            {
                xtype: 'button',
                text: 'get',
                handler: function(){
                    //var a = this.ownerCt.ownerCt.getComponent('templateId').setSingleValue('168803');
                    this.ownerCt.ownerCt.getComponent('combo').reset();
                    //a.isValid();
                    //a.setActiveError("不能为空！")
                    //console.log(a.setActiveError("不能为空！"));
                }
            },{
                xtype: 'button',
                text: 'window',
                handler: function(){
                    var win = Ext.create('Ext.window.Window',{
                        itemId: 'win',
                        title: 'win',
                        items: [defaultLanguage]
                    });
                    win.show();
                }
            }
        ]
    };
    var page = Ext.create('Ext.container.Viewport',{
        layout: 'border',
        width: 800,
        height: 600,
        items: [form]
    });

});