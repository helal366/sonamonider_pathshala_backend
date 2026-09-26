### User Present Address

* POST `/api/v1/smps/user/present_address/create`
  JSON:
  ```json
  {
    "required_id": "USER_UUID"
  }
  ```
  ------> Only the required values are set here. See the zod schema to get the full requirement.

* DELETE `/api/v1/smps/user/present_address/delete`
  JSON:
  ```json
  {
    "required_id": "USER_UUID"
  }
  ```

* PATCH `/api/v1/smps/user/present_address/update_house_no`
  JSON:
  ```json
  {
    "required_id": "USER_UUID",
    "value": "HOUSE NUMBER"
  }
  ```

* PATCH `/api/v1/smps/user/present_address/update_house_name`
  JSON:
  ```json
  {
    "required_id": "USER_UUID",
    "value": "HOUSE NAME"
  }
  ```

* PATCH `/api/v1/smps/user/present_address/update_plot_no`
  JSON:
  ```json
  {
    "required_id": "USER_UUID",
    "value": "PLOT NUMBER"
  }
  ```

* PATCH `/api/v1/smps/user/present_address/update_road_no`
  JSON:
  ```json
  {
    "required_id": "USER_UUID",
    "value": "ROAD NUMBER"
  }
  ```

* PATCH `/api/v1/smps/user/present_address/update_neighbourhood`
  JSON:
  ```json
  {
    "required_id": "USER_UUID",
    "value": "NEIGHBOURHOOD"
  }
  ```

* PATCH `/api/v1/smps/user/present_address/update_region`
  JSON:
  ```json
  {
    "required_id": "USER_UUID",
    "value": "REGION"
  }
  ```

* PATCH `/api/v1/smps/user/present_address/update_village`
  JSON:
  ```json
  {
    "required_id": "USER_UUID",
    "value": "VILLAGE"
  }
  ```

* PATCH `/api/v1/smps/user/present_address/update_post_code`
  JSON:
  ```json
  {
    "required_id": "USER_UUID",
    "value": "POST CODE"
  }
  ```

* PATCH `/api/v1/smps/user/present_address/update_post_office`
  JSON:
  ```json
  {
    "required_id": "USER_UUID",
    "value": "POST OFFICE"
  }
  ```

* PATCH `/api/v1/smps/user/present_address/update_thana`
  JSON:
  ```json
  {
    "required_id": "USER_UUID",
    "value": "THANA"
  }
  ```

* PATCH `/api/v1/smps/user/present_address/update_district`
  JSON:
  ```json
  {
    "required_id": "USER_UUID",
    "value": "DISTRICT"
  }
  ```

* PATCH `/api/v1/smps/user/present_address/update_country`
  JSON:
  ```json
  {
    "required_id": "USER_UUID",
    "value": "Bangladesh"
  }
  ```

#### Delete individual optional fields

* DELETE `/api/v1/smps/user/present_address/delete_house_no`
  JSON:
  ```json
  {
    "required_id": "USER_UUID"
  }
  ```

* DELETE `/api/v1/smps/user/present_address/delete_house_name`
  JSON:
  ```json
  {
    "required_id": "USER_UUID"
  }
  ```

* DELETE `/api/v1/smps/user/present_address/delete_plot_no`
  JSON:
  ```json
  {
    "required_id": "USER_UUID"
  }
  ```

* DELETE `/api/v1/smps/user/present_address/delete_road_no`
  JSON:
  ```json
  {
    "required_id": "USER_UUID"
  }
  ```

* DELETE `/api/v1/smps/user/present_address/delete_neighbourhood`
  JSON:
  ```json
  {
    "required_id": "USER_UUID"
  }
  ```

* DELETE `/api/v1/smps/user/present_address/delete_region`
  JSON:
  ```json
  {
    "required_id": "USER_UUID"
  }
  ```

* DELETE `/api/v1/smps/user/present_address/delete_village`
  JSON:
  ```json
  {
    "required_id": "USER_UUID"
  }
  ```

* DELETE `/api/v1/smps/user/present_address/delete_post_code`
  JSON:
  ```json
  {
    "required_id": "USER_UUID"
  }
  ```

* DELETE `/api/v1/smps/user/present_address/delete_post_office`
  JSON:
  ```json
  {
    "required_id": "USER_UUID"
  }
  ```

### User Permanent Address

* POST `/api/v1/smps/user/permanent_address/create`
  JSON:
  ```json
  {
    "required_id": "USER_UUID"
  }
  ```

  ------> Only the required values are set here. See the zod schema to get the full requirement.

* DELETE `/api/v1/smps/user/permanent_address/delete`
  JSON:
  ```json
  {
    "required_id": "USER_UUID"
  }
  ```

* PATCH `/api/v1/smps/user/permanent_address/update_house_no`
  JSON:
  ```json
  {
    "required_id": "USER_UUID",
    "value": "HOUSE NUMBER"
  }
  ```

* PATCH `/api/v1/smps/user/permanent_address/update_house_name`
  JSON:
  ```json
  {
    "required_id": "USER_UUID",
    "value": "HOUSE NAME"
  }
  ```

* PATCH `/api/v1/smps/user/permanent_address/update_plot_no`
  JSON:
  ```json
  {
    "required_id": "USER_UUID",
    "value": "PLOT NUMBER"
  }
  ```

* PATCH `/api/v1/smps/user/permanent_address/update_road_no`
  JSON:
  ```json
  {
    "required_id": "USER_UUID",
    "value": "ROAD NUMBER"
  }
  ```

* PATCH `/api/v1/smps/user/permanent_address/update_neighbourhood`
  JSON:
  ```json
  {
    "required_id": "USER_UUID",
    "value": "NEIGHBOURHOOD"
  }
  ```

* PATCH `/api/v1/smps/user/permanent_address/update_region`
  JSON:
  ```json
  {
    "required_id": "USER_UUID",
    "value": "REGION"
  }
  ```

* PATCH `/api/v1/smps/user/permanent_address/update_village`
  JSON:
  ```json
  {
    "required_id": "USER_UUID",
    "value": "VILLAGE"
  }
  ```

* PATCH `/api/v1/smps/user/permanent_address/update_post_code`
  JSON:
  ```json
  {
    "required_id": "USER_UUID",
    "value": "POST CODE"
  }
  ```

* PATCH `/api/v1/smps/user/permanent_address/update_post_office`
  JSON:
  ```json
  {
    "required_id": "USER_UUID",
    "value": "POST OFFICE"
  }
  ```

* PATCH `/api/v1/smps/user/permanent_address/update_thana`
  JSON:
  ```json
  {
    "required_id": "USER_UUID",
    "value": "THANA"
  }
  ```

* PATCH `/api/v1/smps/user/permanent_address/update_district`
  JSON:
  ```json
  {
    "required_id": "USER_UUID",
    "value": "DISTRICT"
  }
  ```

* PATCH `/api/v1/smps/user/permanent_address/update_country`
  JSON:
  ```json
  {
    "required_id": "USER_UUID",
    "value": "Bangladesh"
  }
  ```

#### Delete individual optional fields

* DELETE `/api/v1/smps/user/permanent_address/delete_house_no`
* DELETE `/api/v1/smps/user/permanent_address/delete_house_name`
* DELETE `/api/v1/smps/user/permanent_address/delete_plot_no`
* DELETE `/api/v1/smps/user/permanent_address/delete_road_no`
* DELETE `/api/v1/smps/user/permanent_address/delete_neighbourhood`
* DELETE `/api/v1/smps/user/permanent_address/delete_region`
* DELETE `/api/v1/smps/user/permanent_address/delete_village`
* DELETE `/api/v1/smps/user/permanent_address/delete_post_code`
* DELETE `/api/v1/smps/user/permanent_address/delete_post_office`

JSON for each:
```json
{
  "required_id": "USER_UUID"
}
```

### Spouse Information Present Address

* POST `/api/v1/smps/spouse_information/present_address/create`
  JSON:
  ```json
  {
    "required_id": "SPOUSE_INFORMATION_UUID"
  }
  ```

  ------> Only the required values are set here. See the zod schema to get the full requirement.

* DELETE `/api/v1/smps/spouse_information/present_address/delete`
  JSON:
  ```json
  {
    "required_id": "SPOUSE_INFORMATION_UUID"
  }
  ```

* PATCH `/api/v1/smps/spouse_information/present_address/update_house_no`
* PATCH `/api/v1/smps/spouse_information/present_address/update_house_name`
* PATCH `/api/v1/smps/spouse_information/present_address/update_plot_no`
* PATCH `/api/v1/smps/spouse_information/present_address/update_road_no`
* PATCH `/api/v1/smps/spouse_information/present_address/update_neighbourhood`
* PATCH `/api/v1/smps/spouse_information/present_address/update_region`
* PATCH `/api/v1/smps/spouse_information/present_address/update_village`
* PATCH `/api/v1/smps/spouse_information/present_address/update_post_code`
* PATCH `/api/v1/smps/spouse_information/present_address/update_post_office`
* PATCH `/api/v1/smps/spouse_information/present_address/update_thana`
* PATCH `/api/v1/smps/spouse_information/present_address/update_district`
* PATCH `/api/v1/smps/spouse_information/present_address/update_country`

JSON for each PATCH:
```json
{
  "required_id": "SPOUSE_INFORMATION_UUID",
  "value": "VALUE"
}
```

#### Delete individual optional fields

* DELETE `/api/v1/smps/spouse_information/present_address/delete_house_no`
* DELETE `/api/v1/smps/spouse_information/present_address/delete_house_name`
* DELETE `/api/v1/smps/spouse_information/present_address/delete_plot_no`
* DELETE `/api/v1/smps/spouse_information/present_address/delete_road_no`
* DELETE `/api/v1/smps/spouse_information/present_address/delete_neighbourhood`
* DELETE `/api/v1/smps/spouse_information/present_address/delete_region`
* DELETE `/api/v1/smps/spouse_information/present_address/delete_village`
* DELETE `/api/v1/smps/spouse_information/present_address/delete_post_code`
* DELETE `/api/v1/smps/spouse_information/present_address/delete_post_office`

JSON:
```json
{
  "required_id": "SPOUSE_INFORMATION_UUID"
}
```

### Spouse Information Permanent Address

* POST `/api/v1/smps/spouse_information/permanent_address/create`
  JSON:
  ```json
  {
    "required_id": "SPOUSE_INFORMATION_UUID"
  }
  ```

  ------> Only the required values are set here. See the zod schema to get the full requirement.

* DELETE `/api/v1/smps/spouse_information/permanent_address/delete`
  JSON:
  ```json
  {
    "required_id": "SPOUSE_INFORMATION_UUID"
  }
  ```

* PATCH `/api/v1/smps/spouse_information/permanent_address/update_house_no`
* PATCH `/api/v1/smps/spouse_information/permanent_address/update_house_name`
* PATCH `/api/v1/smps/spouse_information/permanent_address/update_plot_no`
* PATCH `/api/v1/smps/spouse_information/permanent_address/update_road_no`
* PATCH `/api/v1/smps/spouse_information/permanent_address/update_neighbourhood`
* PATCH `/api/v1/smps/spouse_information/permanent_address/update_region`
* PATCH `/api/v1/smps/spouse_information/permanent_address/update_village`
* PATCH `/api/v1/smps/spouse_information/permanent_address/update_post_code`
* PATCH `/api/v1/smps/spouse_information/permanent_address/update_post_office`
* PATCH `/api/v1/smps/spouse_information/permanent_address/update_thana`
* PATCH `/api/v1/smps/spouse_information/permanent_address/update_district`
* PATCH `/api/v1/smps/spouse_information/permanent_address/update_country`

JSON for each PATCH:
```json
{
  "required_id": "SPOUSE_INFORMATION_UUID",
  "value": "VALUE"
}
```

#### Delete individual optional fields

* DELETE `/api/v1/smps/spouse_information/permanent_address/delete_house_no`
* DELETE `/api/v1/smps/spouse_information/permanent_address/delete_house_name`
* DELETE `/api/v1/smps/spouse_information/permanent_address/delete_plot_no`
* DELETE `/api/v1/smps/spouse_information/permanent_address/delete_road_no`
* DELETE `/api/v1/smps/spouse_information/permanent_address/delete_neighbourhood`
* DELETE `/api/v1/smps/spouse_information/permanent_address/delete_region`
* DELETE `/api/v1/smps/spouse_information/permanent_address/delete_village`
* DELETE `/api/v1/smps/spouse_information/permanent_address/delete_post_code`
* DELETE `/api/v1/smps/spouse_information/permanent_address/delete_post_office`

JSON:
```json
{
  "required_id": "SPOUSE_INFORMATION_UUID"
}
```
