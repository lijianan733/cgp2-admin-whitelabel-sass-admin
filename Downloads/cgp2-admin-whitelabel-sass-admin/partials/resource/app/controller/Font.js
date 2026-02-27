Ext.define('CGP.resource.controller.Font', {
    extend: 'Ext.app.Controller',
    stores: [
        'Font'
    ],
    models: ['Font'],
    views: [
        'font.Main',
        // 'font.Edit',
    ],
    init: function() {
        this.control({
            'button[itemId=add]': {
                click: this.selectLanguage
            }

        });
    },
    selectLanguage:function (btn){
        var me = this;
        var store = btn.ownerCt.ownerCt.getStore();
        var filterData = store.data.items;
        Ext.create("CGP.font.view.AddLanguageWindow",{
            store : store,
            controller : me,
            filterData: filterData
        }).show();
    },

    addLanguage : function(records,win,store) {
        var data = [];
        Ext.each(records,function (item) {
            data.push(item.data);
        });
        store.add(data);
        win.close();
    },
});