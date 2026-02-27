/**
 * Created by nan on 2020/10/29
 */
Ext.define('CGP.systembuilderconfig.controller.Controller', {
    setDefaultConfig: function (record, grid) {
        var url = adminPath + 'api/systembuilderconfigs/' + record.getId() + '/default';
        JSAjaxRequest(url, 'put', false, null, null, function () {
            grid.store.load();
        });

    }
})
