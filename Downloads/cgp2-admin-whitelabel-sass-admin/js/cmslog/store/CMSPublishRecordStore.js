/**
 * @Description:
 * @author nan
 * @date 2022/4/28
 */
Ext.define('CGP.cmslog.store.CMSPublishRecordStore', {
    extend: 'Ext.data.Store',
    requires: ["CGP.cmslog.model.CMSPublishRecordListModel"],
    model: 'CGP.cmslog.model.CMSPublishRecordListModel',
    remoteSort: 'true',
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        timeout: 60000,
        url: adminPath + 'api/cmsPublishRecords/v2',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    sorters: [{
        property: 'createdDate',
        direction: 'DESC'
    }],
    autoLoad: true
});