
Ext.Loader.syncRequire(["CGP.cmspublishgoals.model.CmsPublishGoal","CGP.cmspublishgoals.view.QueryFiledContainer"]);
Ext.onReady(function(){



    var websiteStore = Ext.create("CGP.common.store.Website");


    //页面的url参数。如果id不为null。说明是编辑。
    var urlParams = Ext.Object.fromQueryString(location.search);
    var cmsPublishGoalModel = null;
    if(urlParams.id != null){
        cmsPublishGoalModel = Ext.ModelManager.getModel("CGP.cmspublishgoals.model.CmsPublishGoal");
    }
    var controller = Ext.create('CGP.cmspublishgoals.controller.Controller');
    var name = {
        name: 'name',
        xtype: 'textfield',
        fieldLabel: i18n.getKey('name'),
        itemId: 'name'
    };
    var jenkinsTaskUrl = {
        name: 'jenkinsTaskUrl',
        xtype: 'textfield',
        fieldLabel: i18n.getKey('jenkinsTaskUrl'),
        itemId: 'jenkinsTaskUrl'
    };
    var pageQuery = {
        xtype: 'queryfieldcontainer',
        title: i18n.getKey('pageQuery'),
        itemId: 'pageQueryId',
        name: 'pageQueryId',
        type: 'query'
    };
    var productQuery = {
        xtype: 'queryfieldcontainer',
        title: i18n.getKey('productQuery'),
        itemId: 'productQuery',
        name: 'productQueryId',
        type: 'query'
    };
    var pageFilter = {
        xtype: 'queryfieldcontainer',
        title: i18n.getKey('pageFilter'),
        itemId: 'pageFilterId',
        name: 'pageFilterId',
        type: 'filter'
    };
    var productFilter = {
        xtype: 'queryfieldcontainer',
        itemId: 'productFilterId',
        title: i18n.getKey('productFilter'),
        name: 'productFilterId',
        type: 'filter'
    };
    var website = {
        xtype: 'gridcombo',
        //matchFieldWidth: true,
        itemId: 'websiteCombo',
        fieldLabel: i18n.getKey('website'),
        allowBlank: false,
        name: 'website',
        multiSelect: false,
        displayField: 'name',
        valueField: 'id',
        width: 450,
        store: websiteStore,
        queryMode: 'remote',
        gridCfg: {
            store: websiteStore,
            width: 350,
            hideHeaders : true,
            columns: [{
                text: 'name',
                width: 350,
                dataIndex: 'name'
            }]
        }
    };
    var editPage = Ext.create("Ext.container.Viewport",{
        autoScroll : true,
        layout : 'fit',
        items : [{
            xtype : "form",
            bodyPadding : 25,
            region: 'center',
            /*layout: {
                type: 'table',
                columns: 2*//*, //每行有几列
                //默认样式
                tableAttrs: {
                    style: "width:100;height:40;"
                }*//*
            },*/
            autoScroll : true,
            defaults: {
                width: 600
            },
            tbar : [{
                xtype : "button",
                text : i18n.getKey('save'),
                iconCls : 'icon_save',
                handler : function(){
                    var form = this.ownerCt.ownerCt;
                    if(form.isValid()){
                        //利用promotionRuleModel来判断是修改还是新建
                        var mask = editPage.setLoading();
                        var items = form.items.items;
                        controller.saveCmsPublishGoal(items,cmsPublishGoalModel,mask);
                    }
                }
            },{
                xtype : 'button',
                itemId : "copy",
                text : i18n.getKey('copy'),
                iconCls : 'icon_copy',
                disabled : urlParams.id != null ?false:true,
                handler : function(){
                    cmsPublishGoalModel = null;
//					urlParams.id = null;
                    this.setDisabled(true);
                    window.parent.Ext.getCmp("cmspublishgoals_edit").setTitle(i18n.getKey('create') +"_"+ i18n.getKey('cmspublishgoals'));
                    var form = this.ownerCt.ownerCt;
                    Ext.Array.each(form.items.items,function(item){
                        if(item.type == 'query' || item.type == 'filter'){
                            item.getComponent('id').setValue(null);
                        }
                    });
                }
            },{
                xtype: 'button',
                itemId: 'btnReset'
                , text: i18n.getKey('reset')
                , iconCls: 'icon_reset',
                handler: function(){
                    if(urlParams.id != null){
                        var model = Ext.ModelManager.getModel("CGP.cmspublishgoals.model.CmsPublishGoal");
                        model.load(Number(urlParams.id),{
                            success : function(record, operation){
                                model = record;
                                var form = editPage.down('form');
                                Ext.Array.each(form.items.items,function(item){
                                    item.setValue(record.get(item.name));
                                });
                            }
                        });
                    }
                }
            }],
            items : [name,jenkinsTaskUrl,website,pageQuery,pageFilter,productQuery,productFilter]
        }],
        listeners : {
            render : function(){
                var me = this;
                if(urlParams.id != null){
                    cmsPublishGoalModel.load(Number(urlParams.id),{
                        success : function(record, operation){
                            cmsPublishGoalModel = record;
                            var form = me.down('form');
                            Ext.Array.each(form.items.items,function(item){
                                item.setValue(record.get(item.name));
                            });
                        }
                    });
                }
            }
        }

    });

});