
Ext.Loader.syncRequire(["CGP.pagecontentschema.model.PageContentSchema"]);
Ext.onReady(function(){



    var websiteStore = Ext.create("CGP.common.store.Website");


    //页面的url参数。如果id不为null。说明是编辑。
    var urlParams = Ext.Object.fromQueryString(location.search);
    var pageContentSchema = null;
    if(urlParams.id != null){
        pageContentSchema = Ext.ModelManager.getModel("CGP.pagecontentschema.model.PageContentSchema");
    }
    var controller = Ext.create('CGP.pagecontentschema.controller.Controller');
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
                        controller.savePageContentSchemaByJSON(items,pageContentSchema,mask);
                    }
                }
            },{
                xtype : 'button',
                itemId : "copy",
                text : i18n.getKey('copy'),
                iconCls : 'icon_copy',
                disabled : urlParams.id != null ?false:true,
                handler : function(){
                    pageContentSchema = null;
//					urlParams.id = null;
                    this.setDisabled(true);
                    window.parent.Ext.getCmp("pagecontentschema_edit").setTitle(i18n.getKey('create') +"_"+ i18n.getKey('pageContentSchema'));
                    var form = this.ownerCt.ownerCt;
                }
            },{
                xtype: 'button',
                itemId: 'btnReset'
                , text: i18n.getKey('reset')
                , iconCls: 'icon_reset',
                handler: function(){
                    if(urlParams.id != null){
                        var model = Ext.ModelManager.getModel("CGP.pagecontentschema.model.PageContentSchema");
                        model.load(Number(urlParams.id),{
                            success : function(record, operation){
                                model = record;
                                var form = editPage.down('form');
                                var valueString = JSON.stringify(record.data,null,"\t");
                                Ext.Array.each(form.items.items,function(item){
                                    item.setValue(valueString);
                                });
                            }
                        });
                    }
                }
            }],
            items : [{
                name: 'value',
                xtype: 'textarea',
                width: 800,
                height: 700,
                autoScroll: true,//通过api文档，我们知道要捕捉keydown事件，必须设置此项
                enableKeyEvents: true,
                //定义制表符
                tabText: '\t',
                //
                listeners: {
                    keydown: function (f, e) {
                        if (e.getKey() == e.TAB) {
                            e.stopEvent();//停止事件
                            insertAtCursor(f.inputEl.dom, f.tabText);
                        }
                        //插入指定字符并重新计算输入光标的位置
                        function insertAtCursor(el, ins) {
                            if (el.setSelectionRange) {
                                var withIns = el.value.substring(0, el.selectionStart) + ins;
                                var pos = withIns.length;
                                el.value = withIns + el.value.substring(el.selectionEnd, el.value.length);
                                el.setSelectionRange(pos, pos);
                            } else if (document.selection) {
                                document.selection.createRange().text = ins;
                            }
                        }
                    }
                },
                fieldLabel: i18n.getKey('data'),
                itemId: 'value'}]
        }],
        listeners : {
            render : function(){
                var me = this;
                if(urlParams.id != null){
                    pageContentSchema.load(Number(urlParams.id),{
                        success : function(record, operation){
                            pageContentSchema = record;
                            var form = me.down('form');
                            Ext.Array.each(form.items.items,function(item){
                                var valueString = JSON.stringify(record.data,null,"\t");
                                item.setValue(valueString);
                            });
                        }
                    });
                }
            }
        }

    });

});
