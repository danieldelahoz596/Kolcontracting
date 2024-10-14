import { HttpParams } from '@angular/common/http';
import { PAGE_SIZE } from '../app.constants';

export class DatatablesUtils {
  static buildDatatablesSettings(extra: any): DataTables.Settings {
    const dtOptions: DataTables.Settings = {
      // 'scrollY': '490px',
      pagingType: 'full_numbers',
      pageLength: PAGE_SIZE,
      scrollCollapse: true,
      // dom: '<"top"flp<"clear">>',
      ...extra,
    };
    return dtOptions;
  }

  static convertToApiParams(dtParams: any): any {
    const params: any = {};
    if (dtParams) {
      params.offset = dtParams.start;
      params.limit = dtParams.length;
      params.search = dtParams.search.value;
      params.sortField = dtParams.columns[dtParams.order[0].column].data;
      params.sortDir = dtParams.order[0].dir;
    }
    return params;
  }
}
