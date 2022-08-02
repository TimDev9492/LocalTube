local function printTimePos()
    mp.msg.info(mp.get_property_number('time-pos'))
    mp.osd_message(mp.get_property_number('time-pos', 0.5))
end

mp.add_periodic_timer(0.1, printTimePos)