Ext.define("CGP.threedmodelconfig.view.ModelRunTimeConfigWin", {
    extend: 'Ext.window.Window',
    grid: null,//window中的主体一个 GridPanel（作用显示选项）
    controller: null,//MainController(为了调controller中的方法)
    store: null, //选项store
    attributeId: null,//对应属性的Id
    autoShow: true,

    modal: true,
    closeAction: 'hidden',
    width: 850, //document.body.clientWidth / 2,
    height: 370, //document.body.clientHeight / 1.5,
    layout: 'fit',


    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        me.title = i18n.getKey('runtimeConfig');
        me.grid = Ext.create("CGP.threedmodelconfig.view.AssetsGrid", {
            modelId: me.modelId,
            win: me
        });
        me.add(me.grid);
    }
});
