set serveroutput on;
declare
    --before using refernce
   -- V_DEPARTMENT_ID NUMBER(4)  not NULL:=1 ;    
    --V_DEPARTMENT_NAME VARCHAR2(50) NOT NULL:='temp'  ;
    --V_LOCATION_ID              NUMBER(4);
    --V_MANAGER_ID               NUMBER(6) ;
    
    --using column references
    V_DEPARTMENT_ID departments.department_id%type;    
    V_DEPARTMENT_NAME  departments.department_name%type;
    V_LOCATION_ID          departments.location_id%type;
    V_MANAGER_ID              departments.manager_id%type;
    
    --short version of the above declaration 
    --r_dept departments%rowtype
    
begin
--retrain table save it to the variables by using INTO with SELECT
    select * into  V_DEPARTMENT_ID,V_DEPARTMENT_NAME,  V_LOCATION_ID,V_MANAGER_ID 
    from departments 
    where department_id=10; 
    
    dbms_output.put_line(V_DEPARTMENT_ID || V_DEPARTMENT_NAME ||  V_LOCATION_ID || V_MANAGER_ID);
   
end;