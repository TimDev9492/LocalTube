local function printTimePos()
    mp.msg.info(mp.get_property_number('time-pos'))
end

mp.add_periodic_timer(0.1, printTimePos)