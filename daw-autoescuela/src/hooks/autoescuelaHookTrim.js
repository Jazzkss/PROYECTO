export const trimHookAuto = ( autoescuela ) => {
    if( autoescuela.email ) autoescuela.email = autoescuela.email.trim();
    if( autoescuela.contact_info ) autoescuela.contact_info = autoescuela.contact_info.trim();
} 